using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System.Collections.Immutable;
using System.Linq;

namespace AnalyzerFix
{
    [DiagnosticAnalyzer(LanguageNames.CSharp)]
    public class RemoveUnusedUsingsAnalyzer : DiagnosticAnalyzer
    {
        public const string DiagnosticId = "AnalyzerFix_RemoveUnusedUsings";
        private static readonly LocalizableString Title = new LocalizableResourceString(nameof(Resources.RemoveUnusedUsingsAnalyzerTitle), Resources.ResourceManager, typeof(Resources));
        private static readonly LocalizableString MessageFormat = new LocalizableResourceString(nameof(Resources.RemoveUnusedUsingsAnalyzerMessageFormat), Resources.ResourceManager, typeof(Resources));
        private static readonly LocalizableString Description = new LocalizableResourceString(nameof(Resources.RemoveUnusedUsingsAnalyzerDescription), Resources.ResourceManager, typeof(Resources));
        private const string Category = "Style";

        private static readonly DiagnosticDescriptor Rule = new DiagnosticDescriptor(
            DiagnosticId, Title, MessageFormat, Category,
            DiagnosticSeverity.Info, isEnabledByDefault: true, description: Description);

        public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics => ImmutableArray.Create(Rule);

        public override void Initialize(AnalysisContext context)
        {
            context.ConfigureGeneratedCodeAnalysis(GeneratedCodeAnalysisFlags.None);
            context.EnableConcurrentExecution();
            context.RegisterSemanticModelAction(AnalyzeUsings);
        }

        private static void AnalyzeUsings(SemanticModelAnalysisContext context)
        {
            var semanticModel = context.SemanticModel;
            var compilationUnit = (CompilationUnitSyntax)semanticModel.SyntaxTree.GetRoot(context.CancellationToken);

            foreach (var usingDirective in compilationUnit.Usings)
            {
                var symbolInfo = semanticModel.GetSymbolInfo(usingDirective.Name);
                var namespaceSymbol = symbolInfo.Symbol as INamespaceOrTypeSymbol;

                if (namespaceSymbol == null)
                {
                    continue;
                }

                var isUsed = compilationUnit.DescendantNodes()
                    .OfType<IdentifierNameSyntax>()
                    .Any(id =>
                    {
                        var symbol = semanticModel.GetSymbolInfo(id).Symbol;
                        return symbol != null &&
                               symbol.ContainingNamespace != null &&
                               SymbolEqualityComparer.Default.Equals(symbol.ContainingNamespace, namespaceSymbol);
                    });

                if (!isUsed)
                {
                    var diagnostic = Diagnostic.Create(
                        Rule,
                        usingDirective.GetLocation(),
                        usingDirective.Name.ToString());

                    context.ReportDiagnostic(diagnostic);
                }
            }
        }
    }
}
