"use client";

import { useService } from "@/contexts/ServiceContext";
import { useCallback, useMemo, useState } from "react";

export function resolveActiveServiceFilter({
  globalServiceId,
  localServiceId,
  hasLocalSelection,
  allValue = "all",
}) {
  if (hasLocalSelection) {
    return localServiceId === allValue ? undefined : localServiceId;
  }

  if (localServiceId !== allValue) {
    return localServiceId;
  }

  if (globalServiceId !== allValue) {
    return globalServiceId;
  }

  return undefined;
}

export default function useServiceFiltering({
  initialLocalServiceId = "all",
  allValue = "all",
} = {}) {
  const { selectedServiceId: globalServiceId } = useService();
  const [localServiceId, setLocalServiceId] = useState(initialLocalServiceId);
  const [hasLocalSelection, setHasLocalSelection] = useState(false);

  const activeServiceFilter = useMemo(
    () =>
      resolveActiveServiceFilter({
        globalServiceId,
        localServiceId,
        hasLocalSelection,
        allValue,
      }),
    [allValue, globalServiceId, hasLocalSelection, localServiceId],
  );

  const setLocalFilter = useCallback(
    (nextValue) => {
      setLocalServiceId(nextValue);
      setHasLocalSelection(true);
    },
    [setLocalServiceId],
  );

  const clearLocalFilter = useCallback(() => {
    setLocalServiceId(allValue);
    setHasLocalSelection(false);
  }, [allValue]);

  return {
    globalServiceId,
    localServiceId,
    hasLocalSelection,
    activeServiceFilter,
    setLocalServiceId,
    setLocalFilter,
    clearLocalFilter,
    isLocalOverrideActive: hasLocalSelection,
  };
}
