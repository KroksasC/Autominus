using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;
using System.Collections.Immutable;
using Microsoft.CodeAnalysis.Text;
using System.Linq;

[DiagnosticAnalyzer(LanguageNames.CSharp)]
public class OperatorSpacingAnalyzer : DiagnosticAnalyzer
{
    public const string DiagnosticId = "OperatorSpacing";

    private static readonly LocalizableString Title = "Operator spacing is incorrect";
    private static readonly LocalizableString MessageFormat = "Operator '{0}' should have consistent spacing.";
    private static readonly LocalizableString Description = "Ensure consistent spacing around operators.";
    private const string Category = "Formatting";

    private static readonly DiagnosticDescriptor Rule = new DiagnosticDescriptor(
        DiagnosticId, Title, MessageFormat, Category,
        DiagnosticSeverity.Warning, isEnabledByDefault: true, description: Description);

    public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics => ImmutableArray.Create(Rule);

    // Operators to check (add more as needed)
    private static readonly string[] TargetOperators = new[]
    {
        "=", "+", "-", "*", "/", "%", "==", "!=", "<", ">", "<=", ">=", "&&", "||", "++", "--"
    };

    public override void Initialize(AnalysisContext context)
    {
        context.ConfigureGeneratedCodeAnalysis(GeneratedCodeAnalysisFlags.None);
        context.EnableConcurrentExecution();
        context.RegisterSyntaxTreeAction(AnalyzeSyntaxTree);
    }

    private static void AnalyzeSyntaxTree(SyntaxTreeAnalysisContext context)
    {
        var root = context.Tree.GetRoot(context.CancellationToken);
        var text = context.Tree.GetText(context.CancellationToken);

        // Scan all tokens in the syntax tree
        foreach (var token in root.DescendantTokens())
        {
            if (TargetOperators.Contains(token.Text))
            {
                CheckOperatorSpacing(token, text, context);
            }
        }
    }

    private static void CheckOperatorSpacing(SyntaxToken operatorToken, SourceText text, SyntaxTreeAnalysisContext context)
    {
        var operatorSpan = operatorToken.Span;
        var line = text.Lines.GetLineFromPosition(operatorSpan.Start);

        // Get the full line text
        var lineText = line.ToString();

        // Find the operator's position within the line
        var operatorPosInLine = operatorSpan.Start - line.Start;

        // Check left spacing (if not at start of line)
        if (operatorPosInLine > 0)
        {
            char leftChar = lineText[operatorPosInLine - 1];
            if (leftChar != ' ')
            {
                ReportDiagnostic(operatorToken, context);
                return;
            }
        }

        // Check right spacing (if not at end of line)
        if (operatorPosInLine + operatorSpan.Length < lineText.Length)
        {
            char rightChar = lineText[operatorPosInLine + operatorSpan.Length];
            if (rightChar != ' ')
            {
                ReportDiagnostic(operatorToken, context);
            }
        }
    }

    private static void ReportDiagnostic(SyntaxToken operatorToken, SyntaxTreeAnalysisContext context)
    {
        var diagnostic = Diagnostic.Create(
            Rule,
            Location.Create(operatorToken.SyntaxTree, operatorToken.Span),
            operatorToken.Text);

        context.ReportDiagnostic(diagnostic);
    }
}