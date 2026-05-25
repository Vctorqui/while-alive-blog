import Link from "next/link";

export default function StoryNotFound() {
    return (
        <div className="max-w-2xl mx-auto px-6 py-20">
            <div className="text-center">

                <h1 className="font-serif text-2xl text-foreground mb-4">
                    Historia no encontrada
                </h1>

                <div className="font-mono text-sm text-destructive/70 mb-8">
                    error: No such file or directory
                </div>

                <p className="font-serif text-muted-foreground mb-12 max-w-md mx-auto">
                    Esta historia no existe, fue eliminada, o quizás nunca fue escrita.
                    Algunas palabras prefieren permanecer en silencio.
                </p>

                <Link
                    href="/"
                    className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                >
                    <span className="text-muted-foreground/50">$</span>
                    <span>Volver</span>
                </Link>
            </div>
        </div>
    );
}
