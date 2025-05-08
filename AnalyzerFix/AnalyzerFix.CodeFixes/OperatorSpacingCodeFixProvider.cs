using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CodeFixes;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Formatting;
using System.Collections.Immutable;
using System.Composition;
using System.Linq;
using System.Threading.Tasks;

[ExportCodeFixProvider(LanguageNames.CSharp, Name = nameof(OperatorSpacingCodeFixProvider))]
[Shared]
public class OperatorSpacingCodeFixProvider : CodeFixProvider
{
    public sealed override ImmutableArray<string> FixableDiagnosticIds =>
        ImmutableArray.Create(OperatorSpacingAnalyzer.DiagnosticId);

    public sealed override FixAllProvider GetFixAllProvider() =>
        WellKnownFixAllProviders.BatchFixer;

    public sealed override async Task RegisterCodeFixesAsync(CodeFixContext context)
    {
        var root = await context.Document.GetSyntaxRootAsync(context.CancellationToken).ConfigureAwait(false);
        var diagnostic = context.Diagnostics.First();
        var diagnosticSpan = diagnostic.Location.SourceSpan;

        // Find the operator token
        var token = root.FindToken(diagnosticSpan.Start);
        if (!token.IsKind(SyntaxKind.None))
        {
            context.RegisterCodeFix(
                Microsoft.CodeAnalysis.CodeActions.CodeAction.Create(
                    title: "Add spaces around operator",
                    createChangedDocument: c => FixOperatorSpacingAsync(context.Document, token, c),
                    equivalenceKey: "Add spaces around operator"),
                diagnostic);
        }
    }

    private async Task<Document> FixOperatorSpacingAsync(Document document, SyntaxToken operatorToken, System.Threading.CancellationToken cancellationToken)
    {
        var root = await document.GetSyntaxRootAsync(cancellationToken).ConfigureAwait(false);
        var newOperatorToken = operatorToken
            .WithLeadingTrivia(operatorToken.LeadingTrivia.Add(SyntaxFactory.Space))
            .WithTrailingTrivia(operatorToken.TrailingTrivia.Add(SyntaxFactory.Space));

        var newRoot = root.ReplaceToken(operatorToken, newOperatorToken);
        return document.WithSyntaxRoot(newRoot);
    }
}