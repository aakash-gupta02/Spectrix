"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import Container from "@/components/dashboard/common/Container";
import SectionHeading from "@/components/dashboard/common/SectionHeading";
import DashboardButton from "@/components/ui/DashboardButton";
import { serviceAPI, statuspageAPI } from "@/lib/api/api";
import StatusPageEmptyState from "./_components/StatusPageEmptyState";
import StatusPageSettingsForm from "./_components/StatusPageSettingsForm";

const EMPTY_FORM = {
  name: "",
  description: "",
  logoUrl: "",
  slug: "",
  isPublic: true,
};

function getServiceId(service) {
  return service?._id || service?.id || service?.serviceId || "";
}

function normalizeServiceIds(serviceIds = []) {
  return serviceIds
    .map((item, index) => ({
      serviceId: item?.serviceId || item?._id || item?.id || "",
      order: typeof item?.order === "number" ? item.order : index,
    }))
    .filter((item) => item.serviceId);
}

function normalizeStatusPage(payload) {
  const statuspage = payload?.statuspage || payload?.data?.statuspage || payload?.data || payload;

  if (!statuspage) {
    return null;
  }

  return {
    id: statuspage._id || statuspage.id || "",
    name: statuspage.name || "",
    description: statuspage.description || "",
    logoUrl: statuspage.logoUrl || "",
    slug: statuspage.slug || "",
    isPublic: typeof statuspage.isPublic === "boolean" ? statuspage.isPublic : true,
    serviceIds: normalizeServiceIds(statuspage.serviceIds || []),
  };
}

function toServicePayload(serviceIds = []) {
  return serviceIds.map((serviceId, index) => ({
    serviceId,
    order: index,
  }));
}

function buildCreatePayload(values) {
  return {
    name: values.name.trim(),
    ...(values.description?.trim() ? { description: values.description.trim() } : {}),
    ...(values.logoUrl?.trim() ? { logoUrl: values.logoUrl.trim() } : {}),
    isPublic: Boolean(values.isPublic),
    serviceIds: toServicePayload(values.serviceIds),
  };
}

function buildUpdatePayload(values, currentStatusPage) {
  const nextPayload = {};

  const nextName = values.name.trim();
  const nextDescription = values.description?.trim() || "";
  const nextLogoUrl = values.logoUrl?.trim() || "";
  const nextSlug = values.slug?.trim() || "";
  const nextIsPublic = Boolean(values.isPublic);
  const nextServiceIds = values.serviceIds || [];

  if (nextName && nextName !== (currentStatusPage?.name || "")) {
    nextPayload.name = nextName;
  }

  if (nextDescription !== (currentStatusPage?.description || "")) {
    nextPayload.description = nextDescription;
  }

  if (nextLogoUrl && nextLogoUrl !== (currentStatusPage?.logoUrl || "")) {
    nextPayload.logoUrl = nextLogoUrl;
  }

  if (nextSlug && nextSlug !== (currentStatusPage?.slug || "")) {
    nextPayload.slug = nextSlug;
  }

  if (nextIsPublic !== Boolean(currentStatusPage?.isPublic)) {
    nextPayload.isPublic = nextIsPublic;
  }

  const currentServiceIds = Array.isArray(currentStatusPage?.serviceIds)
    ? currentStatusPage.serviceIds.map((item) => item?.serviceId).filter(Boolean)
    : [];

  const hasServiceChanges =
    nextServiceIds.length !== currentServiceIds.length ||
    nextServiceIds.some((serviceId, index) => serviceId !== currentServiceIds[index]);

  if (hasServiceChanges) {
    nextPayload.serviceIds = toServicePayload(nextServiceIds);
  }

  return nextPayload;
}

export default function StatusPagePage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [statusPage, setStatusPage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const statusPageQuery = useQuery({
    queryKey: ["statuspage", "me"],
    queryFn: statuspageAPI.getMyStatusPage,
    onSuccess: (data) => {
      setStatusPage(normalizeStatusPage(data));
    },
    onError: (error) => {
      setErrorMessage(error?.response?.data?.message || error?.message || "Failed to load status page");
    },
  });

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: serviceAPI.getServices,
  });

  const services = useMemo(
    () => servicesQuery.data?.service?.services || [],
    [servicesQuery.data],
  );

  const availableServiceIds = useMemo(() => services.map((service) => getServiceId(service)).filter(Boolean), [services]);

  const selectedStatusPage = statusPage || normalizeStatusPage(statusPageQuery.data);
  const isLoading = statusPageQuery.isLoading || servicesQuery.isLoading;
  const publicUrl = useMemo(() => {
    if (!selectedStatusPage?.slug) return "";
    return `https://status.spectrix.app/${selectedStatusPage.slug}`;
  }, [selectedStatusPage]);

  const handleCreate = async (values) => {
    setSaving(true);
    setErrorMessage("");

    try {
      const response = await statuspageAPI.createStatusPage(buildCreatePayload(values));
      setStatusPage(normalizeStatusPage(response));
      setShowCreateForm(false);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || "Failed to create status page");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (values) => {
    setSaving(true);
    setErrorMessage("");

    const updatePayload = buildUpdatePayload(values, selectedStatusPage);

    if (!Object.keys(updatePayload).length) {
      setSaving(false);
      setErrorMessage("No changes detected.");
      return;
    }

    try {
      const response = await statuspageAPI.updateStatusPage(updatePayload);
      setStatusPage(normalizeStatusPage(response));
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || "Failed to update status page");
    } finally {
      setSaving(false);
    }
  };

  const showForm = Boolean(selectedStatusPage) || showCreateForm;

  return (
    <Container>
      <SectionHeading
        title="Status Page"
        description="Manage the workspace status page settings, services, and public URL."
      >
        {!selectedStatusPage ? (
          <DashboardButton
            variant="primary"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={14} />
            Create Status Page
          </DashboardButton>
        ) : null}
      </SectionHeading>

      {errorMessage ? (
        <div className="mb-6 border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-300">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex items-center gap-2 border border-dashed border-border bg-surface-1 px-5 py-6 text-sm text-body">
          <Loader2 size={14} className="animate-spin" />
          Loading status page…
        </div>
      ) : null}

      {!showForm && !isLoading ? (
        <StatusPageEmptyState />
      ) : null}

      {showForm && !isLoading ? (
        <StatusPageSettingsForm
          key={selectedStatusPage?.slug || "create-status-page"}
          initialValues={selectedStatusPage || EMPTY_FORM}
          services={services}
          selectedServiceIds={selectedStatusPage?.serviceIds?.map((item) => item.serviceId) || []}
          availableServiceIds={availableServiceIds}
          saving={saving}
          isCreating={!selectedStatusPage}
          publicUrl={publicUrl}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onCancelCreate={() => setShowCreateForm(false)}
        />
      ) : null}
    </Container>
  );
}