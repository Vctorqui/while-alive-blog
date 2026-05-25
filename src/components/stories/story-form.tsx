"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createStoryAction, createMicroPostAction } from "@/app/actions/story-actions";
import { useTheme } from "@/src/components/theme-provider";

type ContentMode = "file" | "line";
type MicroType = "thought" | "phrase" | "question";

const MAX_MICRO_LENGTH = 280;

export function StoryForm() {
  const router = useRouter();
  const { experience } = useTheme();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ContentMode>("file");
  const [microType, setMicroType] = useState<MicroType>("thought");
  const [microContent, setMicroContent] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    
    startTransition(async () => {
      if (mode === "file") {
        const result = await createStoryAction(formData);
        
        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          router.push("/nuevo?enviado=1");
        }
      } else {
        formData.set("type", microType);
        formData.set("content", microContent);
        
        const result = await createMicroPostAction(formData);
        
        if (result.error) {
          setError(result.error);
        } else if (result.success) {
          router.push("/nuevo?enviado=1");
        }
      }
    });
  };

  const charactersRemaining = MAX_MICRO_LENGTH - microContent.length;
  const isOverLimit = charactersRemaining < 0;

  return (
    <form action={handleSubmit} className="space-y-8">
      {error && (
        <div className={`text-sm text-destructive bg-destructive/10 p-4 rounded ${experience === "terminal" ? "font-mono" : "font-sans"}`}>
          {experience === "terminal" ? (
            <>
              <span className="text-destructive/50">error:</span> {error}
            </>
          ) : (
            <>
              <span className="font-semibold">Error:</span> {error}
            </>
          )}
        </div>
      )}

      {/* Mode selector */}
      <div className="space-y-3">
        {experience === "terminal" ? (
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-muted-foreground/50">{"> "}</span>tipo de contenido
          </p>
        ) : (
          <label className="font-serif text-sm font-semibold text-muted-foreground block">
            Selecciona el tipo de contenido
          </label>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`
              px-4 py-2 text-sm transition-colors rounded-sm border cursor-pointer
              ${experience === "terminal" ? "font-mono" : "font-serif"}
              ${mode === "file"
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
              }
            `}
          >
            {experience === "terminal" ? (
              <>
                <span className={mode === "file" ? "text-background/60" : "text-muted-foreground/50"}>
                  [
                </span>
                {" "}Crear Archivo{" "}
                <span className={mode === "file" ? "text-background/60" : "text-muted-foreground/50"}>
                  ]
                </span>
              </>
            ) : (
              "Crear Cuento"
            )}
          </button>
          <button
            type="button"
            onClick={() => setMode("line")}
            className={`
              px-4 py-2 text-sm transition-colors rounded-sm border cursor-pointer
              ${experience === "terminal" ? "font-mono" : "font-serif"}
              ${mode === "line"
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
              }
            `}
          >
            {experience === "terminal" ? (
              <>
                <span className={mode === "line" ? "text-background/60" : "text-muted-foreground/50"}>
                  [
                </span>
                {" "}Escribir Línea{" "}
                <span className={mode === "line" ? "text-background/60" : "text-muted-foreground/50"}>
                  ]
                </span>
              </>
            ) : (
              "Escribir Pensamiento"
            )}
          </button>
        </div>
        <p className={`text-xs text-muted-foreground/50 ${experience === "terminal" ? "font-mono" : "font-serif italic"}`}>
          {mode === "file" 
            ? "Los archivos son cuentos completos con título y cuerpo extenso."
            : "Las líneas son frases, pensamientos o preguntas breves (máx. 280 caracteres)."}
        </p>
      </div>

      {mode === "file" ? (
        <>
          {/* Title field - only for stories */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className={`text-sm text-muted-foreground block ${experience === "terminal" ? "font-mono" : "font-serif font-semibold"}`}
            >
              {experience === "terminal" ? (
                <>
                  <span className="text-muted-foreground/50">{"> "}</span>título
                </>
              ) : (
                "Título"
              )}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="El título de tu historia..."
              className="w-full bg-transparent border-b border-border focus:border-foreground outline-none py-3 font-serif text-xl text-foreground placeholder:text-muted-foreground/40 transition-colors"
            />
          </div>

          {/* Author field */}
          <div className="space-y-2">
            <label
              htmlFor="author"
              className={`text-sm text-muted-foreground block ${experience === "terminal" ? "font-mono" : "font-serif font-semibold"}`}
            >
              {experience === "terminal" ? (
                <>
                  <span className="text-muted-foreground/50">{"> "}</span>autor{" "}
                  <span className="text-muted-foreground/40">(opcional)</span>
                </>
              ) : (
                "Autor (opcional)"
              )}
            </label>
            <input
              type="text"
              id="author"
              name="author"
              placeholder="Anónimo"
              className={`w-full bg-transparent border-b border-border focus:border-foreground outline-none py-3 text-base text-foreground placeholder:text-muted-foreground/40 transition-colors ${
                experience === "terminal" ? "font-mono" : "font-serif"
              }`}
            />
          </div>

          {/* Content field - full story */}
          <div className="space-y-2">
            <label
              htmlFor="content"
              className={`text-sm text-muted-foreground block ${experience === "terminal" ? "font-mono" : "font-serif font-semibold"}`}
            >
              {experience === "terminal" ? (
                <>
                  <span className="text-muted-foreground/50">{"> "}</span>contenido
                </>
              ) : (
                "Contenido"
              )}
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              placeholder="Escribe tu cuento aquí...

Cada párrafo separado por una línea en blanco."
              className="w-full bg-transparent border border-border focus:border-foreground outline-none p-4 font-serif text-base text-foreground placeholder:text-muted-foreground/40 transition-colors rounded resize-none leading-relaxed"
            />
          </div>
        </>
      ) : (
        <>
          {/* Micro-content type selector */}
          <div className="space-y-3">
            {experience === "terminal" ? (
              <p className="font-mono text-sm text-muted-foreground">
                <span className="text-muted-foreground/50">{"> "}</span>tipo de línea
              </p>
            ) : (
              <p className="font-serif text-sm font-semibold text-muted-foreground">
                Tipo de pensamiento
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {(["thought", "phrase", "question"] as MicroType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMicroType(type)}
                  className={`
                    px-3 py-1.5 text-sm transition-colors rounded-sm border cursor-pointer
                    ${experience === "terminal" ? "font-mono" : "font-serif"}
                    ${microType === type
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-muted-foreground"
                    }
                  `}
                >
                  {type === "thought" && (experience === "terminal" ? "pensamiento" : "Pensamiento")}
                  {type === "phrase" && (experience === "terminal" ? "frase" : "Frase")}
                  {type === "question" && (experience === "terminal" ? "pregunta" : "Pregunta")}
                </button>
              ))}
            </div>
          </div>

          {/* Author field */}
          <div className="space-y-2">
            <label
              htmlFor="author-micro"
              className={`text-sm text-muted-foreground block ${experience === "terminal" ? "font-mono" : "font-serif font-semibold"}`}
            >
              {experience === "terminal" ? (
                <>
                  <span className="text-muted-foreground/50">$</span> autor{" "}
                  <span className="text-muted-foreground/40">(opcional)</span>
                </>
              ) : (
                "Autor (opcional)"
              )}
            </label>
            <input
              type="text"
              id="author-micro"
              name="author"
              placeholder="Anónimo"
              className={`w-full bg-transparent border-b border-border focus:border-foreground outline-none py-3 text-base text-foreground placeholder:text-muted-foreground/40 transition-colors ${
                experience === "terminal" ? "font-mono" : "font-serif"
              }`}
            />
          </div>

          {/* Micro-content field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="micro-content"
                className={`text-sm text-muted-foreground block ${experience === "terminal" ? "font-mono" : "font-serif font-semibold"}`}
              >
                {experience === "terminal" ? (
                  <>
                    <span className="text-muted-foreground/50">{"> "}</span>contenido
                  </>
                ) : (
                  "Contenido"
                )}
              </label>
              <span 
                className={`${experience === "terminal" ? "font-mono" : "font-serif"} text-xs ${
                  isOverLimit 
                    ? "text-destructive" 
                    : charactersRemaining <= 50 
                      ? "text-yellow-600 dark:text-yellow-500" 
                      : "text-muted-foreground/50"
                }`}
              >
                {charactersRemaining}
              </span>
            </div>
            <textarea
              id="micro-content"
              value={microContent}
              onChange={(e) => setMicroContent(e.target.value)}
              required
              rows={4}
              placeholder={
                microType === "question" 
                  ? "¿Tu pregunta aquí...?" 
                  : microType === "phrase"
                    ? "Tu frase aquí..."
                    : "Tu pensamiento aquí..."
              }
              className={`
                w-full bg-transparent border focus:border-foreground outline-none p-4 
                ${microType === "phrase" ? "font-serif italic" : (experience === "terminal" ? "font-mono" : "font-serif")} 
                text-base text-foreground placeholder:text-muted-foreground/40 
                transition-colors rounded resize-none leading-relaxed
                ${isOverLimit ? "border-destructive" : "border-border"}
              `}
            />
            {isOverLimit && (
              <p className={`text-xs text-destructive ${experience === "terminal" ? "font-mono" : "font-serif"}`}>
                Excede el límite de {MAX_MICRO_LENGTH} caracteres
              </p>
            )}
          </div>
        </>
      )}

      {/* Submit button */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className={`text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${
            experience === "terminal" ? "font-mono" : "font-serif"
          }`}
        >
          {experience === "terminal" ? (
            <>
              cancelar
            </>
          ) : (
            "Cancelar"
          )}
        </button>
        
        <button
          type="submit"
          disabled={isPending || (mode === "line" && isOverLimit)}
          className={`text-sm bg-foreground text-background px-6 py-3 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
            experience === "terminal" ? "font-mono" : "font-serif font-semibold"
          }`}
        >
          {isPending ? (
            experience === "terminal" ? (
              <>
                <span className="text-background/50">{"> "}</span>ejecutando...
              </>
            ) : (
              "Publicando..."
            )
          ) : (
            experience === "terminal" ? (
              <>
                <span className="text-background/50">{"> "}</span>publicar
              </>
            ) : (
              "Publicar"
            )
          )}
        </button>
      </div>
    </form>
  );
}
