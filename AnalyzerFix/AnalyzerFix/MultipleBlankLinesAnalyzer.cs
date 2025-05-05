using AnalyzerFix;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;
using System.Collections.Immutable;

[DiagnosticAnalyzer(LanguageNames.CSharp)]
public class MultipleBlankLinesAnalyzer : DiagnosticAnalyzer
{
    public const string DiagnosticId = "AnalyzerFix_MultipleBlankLines";

    private static readonly LocalizableString Title = new LocalizableResourceString(
        nameof(Resources.MultipleBlankLinesAnalyzerTitle), Resources.ResourceManager, typeof(Resources));
    private static readonly LocalizableString MessageFormat = new LocalizableResourceString(
        nameof(Resources.MultipleBlankLinesAnalyzerMessageFormat), Resources.ResourceManager, typeof(Resources));
    private static readonly LocalizableString Description = new LocalizableResourceString(
        nameof(Resources.MultipleBlankLinesAnalyzerDescription), Resources.ResourceManager, typeof(Resources));
    private const string Category = "Formatting";

    private static readonly DiagnosticDescriptor Rule = new DiagnosticDescriptor(
        DiagnosticId, Title, MessageFormat, Category,
        DiagnosticSeverity.Warning, isEnabledByDefault: true, description: Description);

    public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics => ImmutableArray.Create(Rule);

    public override void Initialize(AnalysisContext context)
    {
        context.ConfigureGeneratedCodeAnalysis(GeneratedCodeAnalysisFlags.None);
        context.EnableConcurrentExecution();
        context.RegisterSyntaxTreeAction(AnalyzeSyntaxTree);
    }

    private static void AnalyzeSyntaxTree(SyntaxTreeAnalysisContext context)
    {
        var text = context.Tree.GetText(context.CancellationToken);
        var lines = text.Lines;

        int blankLineCount = 0;
        for (int i = 0; i < lines.Count; i++)
        {
            var line = lines[i];
            if (string.IsNullOrWhiteSpace(line.ToString()))
            {
                blankLineCount++;
            }
            else
            {
                blankLineCount = 0;
            }

            if (blankLineCount >= 2)
            {
                var diagnostic = Diagnostic.Create(Rule, Location.Create(context.Tree, line.Span));
                context.ReportDiagnostic(diagnostic);
            }
        }
    }
}
