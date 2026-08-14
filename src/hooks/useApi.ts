import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  errorMessage: string | null;
  isRetrying: boolean;
  retryCount: number;
}

export function useApi<T>(
  fetcherFn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
  fallbackData: T | null = null
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
    errorMessage: null,
    isRetrying: false,
    retryCount: 0,
  });

  const controllerRef = useRef<AbortController | null>(null);

  const executeFetch = useCallback(
    async (isRetry = false) => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      setState(prev => ({
        ...prev,
        loading: !isRetry,
        isRetrying: isRetry,
        error: null,
        errorMessage: null,
      }));

      try {
        const result = await fetcherFn(controller.signal);

        if (!controller.signal.aborted) {
          setState({
            data: result,
            loading: false,
            error: null,
            errorMessage: null,
            isRetrying: false,
            retryCount: isRetry ? state.retryCount + 1 : state.retryCount,
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        if (!controller.signal.aborted) {
          const errObj = err instanceof Error ? err : new Error('An unexpected error occurred');
          const message = errObj.message || 'Failed to fetch data from server.';

          setState({
            data: fallbackData,
            loading: false,
            error: errObj,
            errorMessage: message,
            isRetrying: false,
            retryCount: state.retryCount,
          });
        }
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }
      }
    },
    [...deps]
  );

  useEffect(() => {
    executeFetch(false);

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [executeFetch]);

  const retry = useCallback(() => {
    executeFetch(true);
  }, [executeFetch]);

  return {
    ...state,
    retry,
    refresh: () => executeFetch(false),
  };
}
