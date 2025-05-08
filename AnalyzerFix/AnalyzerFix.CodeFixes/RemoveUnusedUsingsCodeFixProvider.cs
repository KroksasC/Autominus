using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CodeFixes;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.CodeActions;
using Microsoft.CodeAnalysis.Editing;
using System;
using System.Composition;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Immutable;

namespace AnalyzerFix
{
    [ExportCodeFixProvider(LanguageNames.CSharp, Name = nameof(RemoveUnusedUsingsCodeFixProvider)), Shared]
    public class RemoveUnusedUsingsCodeFixProvider : CodeFixProvider
    {
        private const string Title = "Remove unused using directive";

        public sealed override ImmutableArray<string> FixableDiagnosticIds
            => ImmutableArray.Create(RemoveUnusedUsingsAnalyzer.DiagnosticId);

        public sealed override FixAllProvider GetFixAllProvider()
            => WellKnownFixAllProviders.BatchFixer;

        public sealed override async Task RegisterCodeFixesAsync(CodeFixContext context)
        {
            var root = await context.Document.GetSyntaxRootAsync(context.CancellationToken).ConfigureAwait(false);
            var diagnostic = context.Diagnostics.First();
            var diagnosticSpan = diagnostic.Location.SourceSpan;

            var usingDirective = root.FindToken(diagnosticSpan.Start).Parent.AncestorsAndSelf()
                .OfType<UsingDirectiveSyntax>().First();

            context.RegisterCodeFix(
                CodeAction.Create(
                    title: Title,
                    createChangedDocument: c => RemoveUsingDirectiveAsync(context.Document, usingDirective, c),
                    equivalenceKey: Title),
                diagnostic);
        }

        private async Task<Document> RemoveUsingDirectiveAsync(Document document, UsingDirectiveSyntax usingDirective, CancellationToken cancellationToken)
        {
            var root = await document.GetSyntaxRootAsync(cancellationToken).ConfigureAwait(false);
            var newRoot = root.RemoveNode(usingDirective, SyntaxRemoveOptions.KeepNoTrivia);
            return document.WithSyntaxRoot(newRoot);
        }
    }
}
