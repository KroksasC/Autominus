using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CodeFixes;
using Microsoft.CodeAnalysis.Text;
using Microsoft.CodeAnalysis.CodeActions;
using System;
using System.Composition;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Immutable;

namespace AnalyzerFix
{
    [ExportCodeFixProvider(LanguageNames.CSharp, Name = nameof(MultipleBlankLinesCodeFixProvider)), Shared]
    public class MultipleBlankLinesCodeFixProvider : CodeFixProvider
    {
        private const string Title = "Remove extra blank lines";

        public sealed override ImmutableArray<string> FixableDiagnosticIds
            => ImmutableArray.Create(MultipleBlankLinesAnalyzer.DiagnosticId);

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
                    createChangedDocument: c => RemoveExtraBlankLinesAsync(context.Document, c),
                    equivalenceKey: Title),
                diagnostic);
        }

        private async Task<Document> RemoveExtraBlankLinesAsync(Document document, CancellationToken cancellationToken)
        {
            var sourceText = await document.GetTextAsync(cancellationToken).ConfigureAwait(false);
            var lines = sourceText.Lines;

            var sb = new StringBuilder();
            int blankCount = 0;

            foreach (var line in lines)
            {
                string lineText = line.ToString();
                if (string.IsNullOrWhiteSpace(lineText))
                {
                    blankCount++;
                    if (blankCount >= 2)
                    {
                        continue; // skip extra blank lines
                    }
                }
                else
                {
                    blankCount = 0;
                }

                sb.AppendLine(lineText);
            }

            var newText = SourceText.From(sb.ToString(), sourceText.Encoding);
            return document.WithText(newText);
        }
    }
}
