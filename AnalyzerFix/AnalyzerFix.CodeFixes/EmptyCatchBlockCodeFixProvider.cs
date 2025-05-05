using System.Collections.Immutable;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CodeFixes;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Editing;
using Microsoft.CodeAnalysis.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Composition;

[ExportCodeFixProvider(LanguageNames.CSharp, Name = nameof(EmptyCatchBlockCodeFixProvider)), Shared]
public class EmptyCatchBlockCodeFixProvider : CodeFixProvider
{
    public override ImmutableArray<string> FixableDiagnosticIds => ImmutableArray.Create(EmptyCatchBlockAnalyzer.Rule.Id);

    public override Task RegisterCodeFixesAsync(CodeFixContext context)
    {
        var diagnostic = context.Diagnostics[0];
        var diagnosticSpan = diagnostic.Location.SourceSpan;

        // Register the code fix action
        context.RegisterCodeFix(
            Microsoft.CodeAnalysis.CodeActions.CodeAction.Create(
                "Add logging or rethrow exception",
                c => AddLoggingOrRethrowAsync(context.Document, diagnosticSpan, c),
                EmptyCatchBlockAnalyzer.Rule.Id),
            diagnostic);

        return Task.CompletedTask;
    }

    private async Task<Solution> AddLoggingOrRethrowAsync(Document document, TextSpan diagnosticSpan, CancellationToken cancellationToken)
    {
        // Get the root of the document
        var root = await document.GetSyntaxRootAsync(cancellationToken);

        // Find the catch block node
        var catchClause = root.FindNode(diagnosticSpan) as CatchClauseSyntax;

        if (catchClause == null)
            return document.Project.Solution;

        // Create a simple logging statement inside the catch block
        var loggingStatement = SyntaxFactory.ExpressionStatement(
            SyntaxFactory.ParseExpression("Console.WriteLine(ex.Message)"));

        // Add the logging statement inside the catch block
        var newCatchBlock = catchClause.Block.AddStatements(loggingStatement);

        // Replace the old catch block with the new one
        var newCatchClause = catchClause.WithBlock(newCatchBlock);

        // Create a new root with the modified catch clause
        var newRoot = root.ReplaceNode(catchClause, newCatchClause);

        // Return the updated document
        var newDocument = document.WithSyntaxRoot(newRoot);
        return newDocument.Project.Solution;
    }
}
