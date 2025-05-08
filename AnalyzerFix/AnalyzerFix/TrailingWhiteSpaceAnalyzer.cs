using AnalyzerFix;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.Text;
using Microsoft.CodeAnalysis;
using System.Collections.Immutable;

[DiagnosticAnalyzer(LanguageNames.CSharp)]
public class TrailingWhiteSpaceAnalyzer : DiagnosticAnalyzer
{
    public const string DiagnosticId = "AnalyzerFix";

    private static readonly LocalizableString Title = new LocalizableResourceString(
        nameof(Resources.TrailingWhiteSpaceAnalyzerTitle), Resources.ResourceManager, typeof(Resources));
    private static readonly LocalizableString MessageFormat = new LocalizableResourceString(
        nameof(Resources.TrailingWhiteSpaceAnalyzerMessageFormat), Resources.ResourceManager, typeof(Resources));
    private static readonly LocalizableString Description = new LocalizableResourceString(
        nameof(Resources.TrailingWhiteSpaceAnalyzerDescription), Resources.ResourceManager, typeof(Resources));
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

        foreach (var line in lines)
        {
            var lineText = line.ToString();
            if (string.IsNullOrWhiteSpace(lineText))
            {
                continue; // Skip entirely whitespace lines
            }

            // Find the position of the last non-whitespace character
            int lastNonWhitespace = lineText.Length - 1;
            while (lastNonWhitespace >= 0 && char.IsWhiteSpace(lineText[lastNonWhitespace]))
            {
                lastNonWhitespace--;
            }

            if (lastNonWhitespace + 1 < lineText.Length)
            {
                // Calculate the span of just the trailing whitespace
                var whitespaceStart = line.Start + lastNonWhitespace + 1;
                var whitespaceEnd = line.End;
                var whitespaceSpan = new TextSpan(whitespaceStart, whitespaceEnd - whitespaceStart);

                var location = Location.Create(context.Tree, whitespaceSpan);
                var diagnostic = Diagnostic.Create(Rule, location);
                context.ReportDiagnostic(diagnostic);
            }
        }
    }
}