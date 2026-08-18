import * as React from "react"
import { cn } from "@/lib/utils"

export type FileScanState = 'idle' | 'scanning' | 'clean' | 'infected' | 'duplicate'

export interface FileDropzoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onFileSelect?: (files: FileList | null) => void
  accept?: string
  multiple?: boolean
  scanState?: FileScanState
}

export function FileDropzone({ onFileSelect, accept, multiple, scanState = 'idle', className, ...props }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true)
    } else if (e.type === "dragleave") {
      setIsDragging(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (inputRef.current) {
        inputRef.current.files = e.dataTransfer.files
        onFileSelect?.(e.dataTransfer.files)
      }
    }
  }

  return (
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors overflow-hidden",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "hover:bg-surface-container-low",
          scanState === 'idle' && !isDragging && "border-outline-variant bg-surface-container-lowest",
          scanState === 'scanning' && "border-semantic-sky bg-semantic-sky/5",
          scanState === 'clean' && "border-semantic-emerald bg-semantic-emerald/5",
          scanState === 'infected' && "border-semantic-crimson bg-semantic-crimson/5 backdrop-blur-md relative",
          scanState === 'duplicate' && "border-semantic-amber bg-semantic-amber/5",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => {
          if (scanState === 'idle' || scanState === 'clean') {
            inputRef.current?.click()
          }
        }}
      >
        {scanState === 'infected' && (
          <div className="absolute inset-0 bg-semantic-crimson/10 backdrop-blur-[2px] z-0" />
        )}

        <input 
          ref={inputRef}
          type="file" 
          className="hidden" 
          accept={accept}
          multiple={multiple}
          onChange={(e) => onFileSelect?.(e.target.files)}
          {...props} 
        />
        
        <div className="relative z-10 flex flex-col items-center">
          {scanState === 'idle' && (
            <>
              <svg className="w-8 h-8 mb-2 text-on-surface-variant" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              <p className="font-inter text-sm text-on-surface-variant font-medium">
                <span className="text-primary font-semibold">Click to upload</span> or drag and drop
              </p>
              {accept && (
                <p className="font-jetbrains-mono text-xs text-on-surface-variant mt-1 uppercase tracking-wider">
                  {accept.replace(/,/g, ', ')}
                </p>
              )}
            </>
          )}

          {scanState === 'scanning' && (
            <>
              <svg className="w-8 h-8 mb-2 text-semantic-sky animate-pulse" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 0 1 .9 2.7m0 0a3 3 0 0 1-3 3m0 3h.008v.008h-.008v-.008Zm0-6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Zm-3 6h.008v.008h-.008v-.008Z" />
              </svg>
              <p className="font-inter text-sm text-semantic-sky font-medium animate-pulse">
                Scanning for threats with ClamAV...
              </p>
            </>
          )}

          {scanState === 'clean' && (
            <>
              <svg className="w-8 h-8 mb-2 text-semantic-emerald" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
              <p className="font-inter text-sm text-semantic-emerald font-medium">
                File is clean and verified
              </p>
            </>
          )}

          {scanState === 'infected' && (
            <>
              <svg className="w-8 h-8 mb-2 text-semantic-crimson" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z" />
              </svg>
              <p className="font-inter text-sm text-semantic-crimson font-medium">
                Threat detected! Upload blocked.
              </p>
            </>
          )}

          {scanState === 'duplicate' && (
            <>
              <div className="flex gap-2 mb-2">
                <svg className="w-8 h-8 text-semantic-amber" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
              </div>
              <p className="font-inter text-sm text-semantic-amber font-medium">
                Duplicate file detected side-by-side
              </p>
            </>
          )}
        </div>
      </div>
  )
}
