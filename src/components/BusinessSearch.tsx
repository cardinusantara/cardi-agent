'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface SelectedBusiness {
  name: string;
  placeId: string;
  reviewUrl: string;
}

interface BusinessSearchProps {
  onSelect: (business: SelectedBusiness) => void;
  selectedBusinessName?: string;
  label?: string;
  placeholder?: string;
}

export default function BusinessSearch({
  onSelect,
  selectedBusinessName,
  label = 'Nama Bisnis',
  placeholder = 'Ketik nama bisnis untuk cari otomatis',
}: BusinessSearchProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>(selectedBusinessName || '');
  const [prevBusinessName, setPrevBusinessName] = useState<string | undefined>(selectedBusinessName);

  // Sync state with prop during render (React recommended pattern for state adjustment from props)
  if (selectedBusinessName !== prevBusinessName) {
    setPrevBusinessName(selectedBusinessName);
    setInputValue(selectedBusinessName || '');
  }

  const apiKey =
    import.meta.env.PUBLIC_GOOGLE_PLACES_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ||
    '';
  const apiKeyError = !apiKey ? 'Google Places API Key belum dikonfigurasi pada .env.local' : null;
  const displayError = apiKeyError || loadError;

  useEffect(() => {
    if (!apiKey) {
      return;
    }

    const scriptId = 'google-maps-places-script';

    const initAutocomplete = () => {
      if (!inputRef.current || !window.google?.maps?.places) return;

      try {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: 'id' },
            fields: ['place_id', 'name', 'formatted_address', 'geometry'],
          }
        );

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();

          if (place && place.place_id && place.name) {
            const placeId = place.place_id;
            const name = place.name;
            const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;

            setInputValue(name);
            onSelect({
              name,
              placeId,
              reviewUrl,
            });
          }
        });

        autocompleteRef.current = autocomplete;
        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to initialize Google Places Autocomplete:', err);
        setLoadError('Gagal menginisialisasi Google Places Autocomplete');
      }
    };

    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=id`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const handleScriptLoad = () => {
      initAutocomplete();
    };

    const handleScriptError = () => {
      setLoadError('Gagal memuat Google Maps API. Periksa koneksi atau API Key Anda.');
    };

    script.addEventListener('load', handleScriptLoad);
    script.addEventListener('error', handleScriptError);

    return () => {
      if (script) {
        script.removeEventListener('load', handleScriptLoad);
        script.removeEventListener('error', handleScriptError);
      }
    };
  }, [apiKey, onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent submitting parent form when choosing autocomplete options via Enter
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="w-full space-y-2">
      <label
        htmlFor="business-search-input"
        className="block text-sm font-semibold text-zinc-700 dark:text-zinc-200"
      >
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 dark:text-zinc-500">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.15 13.15z"
            />
          </svg>
        </div>

        <input
          ref={inputRef}
          id="business-search-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-10 text-sm text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
        />

        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue('');
              if (inputRef.current) inputRef.current.focus();
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
            title="Hapus pencarian"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {displayError && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      {!displayError && !isLoaded && apiKey && (
        <p className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="inline-block h-2 w-2 animate-ping rounded-full bg-blue-500" />
          Menghubungkan ke Google Maps Places...
        </p>
      )}

      {/* Global CSS helper to ensure Google Places autocomplete dropdown stays on top with modern styling */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .pac-container {
          z-index: 99999 !important;
          border-radius: 0.75rem;
          margin-top: 4px;
          border: 1px solid rgba(228, 228, 231, 1);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
            0 8px 10px -6px rgba(0, 0, 0, 0.1);
          font-family: inherit;
        }
        @media (prefers-color-scheme: dark) {
          .pac-container {
            background-color: #18181b;
            border-color: #27272a;
          }
          .pac-item {
            border-top-color: #27272a;
            color: #d4d4d8;
          }
          .pac-item:hover {
            background-color: #27272a;
          }
          .pac-item-query {
            color: #ffffff;
          }
        }
      `,
        }}
      />
    </div>
  );
}
