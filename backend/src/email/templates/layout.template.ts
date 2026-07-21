export function emailLayout(title: string, content: string): string {

    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
            </head>

            <body style="font-family:Arial; background:#f7f7f7;padding:40px;">
                <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px;">
                    ${content}
                    <hr />
                    <p style="font-size:12px; color:#888;">This email was sent automatically.</p>
                </div>
            </body>
        </html>
    `
}