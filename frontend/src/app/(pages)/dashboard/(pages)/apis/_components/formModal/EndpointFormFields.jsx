"use client";
import React, { useState } from "react";

import DashboardButton from "@/components/ui/DashboardButton";
import LocalServiceDropdown from "@/components/dashboard/layout/LocalServiceDropdown";
import FormCheckbox from "@/components/ui/form/FormCheckbox";
import FormInput from "@/components/ui/form/FormInput";
import FormSelect from "@/components/ui/form/FormSelect";
import FormTextarea from "@/components/ui/form/FormTextarea";
import { X, Plus, Trash2, ListTree, Hash } from "lucide-react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";

export function normalizePath(value) {
  if (!value) {
    return "/";
  }
  return value.startsWith("/") ? value : `/${value}`;
}

export function convertKeyValueToObject(keyValueArray) {
  const obj = {};
  keyValueArray.forEach((item) => {
    if (item.key && item.key.trim()) {
      obj[item.key.trim()] = item.value || "";
    }
  });
  return Object.keys(obj).length > 0 ? obj : undefined;
}

export function objectToKeyValueArray(obj) {
  if (!obj || typeof obj !== "object") return [{ key: "", value: "" }];
  
  const entries = Object.entries(obj);
  if (entries.length === 0) return [{ key: "", value: "" }];
  
  return entries.map(([key, value]) => ({
    key: key,
    value: typeof value === "object" ? JSON.stringify(value) : String(value),
  }));
}

export function parseBody(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

export function parseExpectedStatus(value) {
  const parsed = String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((code) => Number.isInteger(code) && code >= 100 && code <= 599);
  return parsed.length > 0 ? parsed : [200];
}

export function stringifyJsonValue(value) {
  if (value === null || value === undefined || value === "") return "";
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

export function EndpointFormFields({ 
  control, 
  errors, 
  nameInputRef,
  showServiceDropdown = true 
}) {

  const {
    fields: queryFields,
    append: appendQuery,
    remove: removeQuery,
  } = useFieldArray({
    control,
    name: "queryParams",
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control,
    name: "headers",
  });

  const selectedMethod = useWatch({
    control,
    name: "method",
    defaultValue: "GET",
  });

  const [activeTab, setActiveTab] = useState("config");

  const validQueryCount = queryFields.filter(field => field.key && field.key.trim()).length;
  const validHeaderCount = headerFields.filter(field => field.key && field.key.trim()).length;

  return (
    <div>
      {/* Basic Info Section - Always visible */}
      <div className="border-b border-border p-5">
        <h3 className="text-sm font-medium text-heading mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormInput
            name="name"
            label="Endpoint Name"
            placeholder="Home Check"
            maxLength={50}
            inputRef={nameInputRef}
          />

          {showServiceDropdown && (
            <div className="space-y-2">
              <Controller
                name="serviceId"
                control={control}
                render={({ field }) => (
                  <>
                    <LocalServiceDropdown
                      value={field.value}
                      onChange={field.onChange}
                      label="Service"
                    />
                    {errors.serviceId ? (
                      <p className="text-xs text-red-400">{errors.serviceId.message}</p>
                    ) : null}
                  </>
                )}
              />
            </div>
          )}

          <div className={showServiceDropdown ? "md:col-span-2" : "md:col-span-2"}>
            <div className="flex flex-wrap gap-3">
              <div className="w-28">
                <FormSelect
                  name="method"
                  label="HTTP Method"
                  options={[
                    { value: "GET", label: "GET" },
                    { value: "POST", label: "POST" },
                    { value: "PUT", label: "PUT" },
                    { value: "PATCH", label: "PATCH" },
                    { value: "DELETE", label: "DELETE" },
                  ]}
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <FormInput 
                  name="path" 
                  label="Endpoint Path"
                  placeholder="/users or /posts/1" 
                />
              </div>

              <div className="w-32">
                <FormInput
                  name="interval"
                  label="Interval (sec)"
                  type="number"
                  placeholder="300"
                />
              </div>

              <div className="w-24">
                <FormInput
                  name="retries"
                  label="Retries"
                  type="number"
                  placeholder="3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for additional config with badges */}
      <div className="border-b border-border bg-surface-2 px-5">
        <div className="flex gap-6">
          {[
            { id: "config", label: "Config", icon: null },
            { id: "params", label: "Query Params", count: validQueryCount },
            { id: "headers", label: "Headers", count: validHeaderCount },
            { id: "body", label: "Body", icon: null },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-0 py-2 text-sm font-medium border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-body hover:text-heading"
              }`}
            >
              {tab.icon && <tab.icon size={14} />}
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-mono text-primary">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {/* Config Tab */}
        {activeTab === "config" && (
          <div className="space-y-5">
            <FormInput
              name="expectedStatus"
              label="Expected Status Codes (comma separated)"
              placeholder="200, 201, 204"
            />

            <div className="border-t border-border pt-4">
              <FormCheckbox name="active" label="Active endpoint" />
              <p className="mt-1 text-xs text-body/60">
                Disabled endpoints won`&apos;`t be monitored
              </p>
            </div>
          </div>
        )}

        {/* Query Params Tab */}
        {activeTab === "params" && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListTree size={16} className="text-primary" />
                <label className="text-sm font-medium text-heading">Query Parameters</label>
                {validQueryCount > 0 && (
                  <span className="inline-flex h-5 px-1.5 items-center justify-center rounded bg-primary/10 text-xs font-mono text-primary">
                    {validQueryCount} parameter{validQueryCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => appendQuery({ key: "", value: "" })}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Plus size={12} />
                Add Parameter
              </button>
            </div>

            <div className="space-y-2">
              {queryFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <FormInput
                      name={`queryParams.${index}.key`}
                      placeholder="Key"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      name={`queryParams.${index}.value`}
                      placeholder="Value"
                      className="font-mono text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuery(index)}
                    className="mt-2 p-1 text-body/60 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {queryFields.length === 0 && (
              <p className="text-xs text-body/60 text-center py-4">
                No query parameters. Click `&quot;`Add Parameter`&quot;` to add one.
              </p>
            )}
          </div>
        )}

        {/* Headers Tab */}
        {activeTab === "headers" && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash size={16} className="text-primary" />
                <label className="text-sm font-medium text-heading">Headers</label>
                {validHeaderCount > 0 && (
                  <span className="inline-flex h-5 px-1.5 items-center justify-center rounded bg-primary/10 text-xs font-mono text-primary">
                    {validHeaderCount} header{validHeaderCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => appendHeader({ key: "", value: "" })}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Plus size={12} />
                Add Header
              </button>
            </div>

            <div className="space-y-2">
              {headerFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <FormInput
                      name={`headers.${index}.key`}
                      placeholder="Header Name"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <FormInput
                      name={`headers.${index}.value`}
                      placeholder="Header Value"
                      className="font-mono text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHeader(index)}
                    className="mt-2 p-1 text-body/60 hover:text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {headerFields.length === 0 && (
              <p className="text-xs text-body/60 text-center py-4">
                No headers. Click `&quot;`Add Header`&quot;` to add one.
              </p>
            )}
          </div>
        )}

        {/* Body Tab */}
        {activeTab === "body" && (
          <div>
            <FormTextarea
              name="body"
              label="Request Body (JSON)"
              placeholder='{"key": "value"}'
              rows={8}
              className="font-mono"
            />
            <p className="mt-1 text-xs text-body/60">
              {selectedMethod === "GET"
                ? "Note: GET requests typically don't have a body"
                : "Enter valid JSON for the request body"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}