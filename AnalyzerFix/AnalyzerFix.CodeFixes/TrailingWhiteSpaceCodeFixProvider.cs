using System.Composition;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CodeFixes;
using Microsoft.CodeAnalysis.Text;
using Microsoft.CodeAnalysis.CodeActions;
using System.Collections.Immutable;

namespace AnalyzerFix
{
    [ExportCodeFixProvider(LanguageNames.CSharp, Name = nameof(TrailingWhiteSpaceCodeFixProvider)), Shared]
    public class TrailingWhiteSpaceCodeFixProvider : CodeFixProvider
    {
        private const string Title = "Remove trailing whitespace";

        public sealed override ImmutableArray<string> FixableDiagnosticIds
            => ImmutableArray.Create(TrailingWhiteSpaceAnalyzer.DiagnosticId);

        public sealed override FixAllProvider GetFixAllProvider()
            => WellKnownFixAllProviders.BatchFixer;

        public sealed override async Task RegisterCodeFixesAsync(CodeFixContext context)
        {
            var root = await context.Document.GetSyntaxRootAsync(context.CancellationToken).ConfigureAwait(false);
            var diagnostic = context.Diagnostics.First();
            var span = diagnostic.Location.SourceSpan;

            context.RegisterCodeFix(
                CodeAction.Create(
                    title: Title,
                    createChangedDocument: c => RemoveTrailingWhitespaceAsync(context.Document, span, c),
                    equivalenceKey: Title),
                diagnostic);
        }

        private async Task<Document> RemoveTrailingWhitespaceAsync(Document document, TextSpan span, CancellationToken cancellationToken)
        {
            var sourceText = await document.GetTextAsync(cancellationToken).ConfigureAwait(false);
            var line = sourceText.Lines.FirstOrDefault(l => l.Span.Contains(span.Start));

            if (line != null)
            {
                var newLineText = line.ToString().TrimEnd();
                var newSourceText = sourceText.Replace(line.Span, newLineText);
                return document.WithText(newSourceText);
            }

            return document;
        }
    }
}
