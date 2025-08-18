"use client";

import { useMemo, useState } from "react";
import GroupsSelect from "@/components/dashboard/events/selectGroups";
import { SubmitButton } from "@/components/form/submitButton";

type Group = { id: string; username: string };

type EventFormProps = {
    mode?: "create" | "edit";
    onSubmitAction: (formData: FormData) => Promise<void>;
    groups: Group[];
    initialValues?: {
        eventId?: string;
        title?: string;
        description?: string;
        location?: string;
        address?: string;
        start?: string;
        end?: string;
        groupIds?: string[];
    };
    submitLabel?: string;
    pendingText?: string;
};

const toLocalInput = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

const nowLocal = () => toLocalInput(new Date());

export default function EventForm({
    mode = "create",
    onSubmitAction,
    groups,
    initialValues,
    submitLabel,
    pendingText,
}: EventFormProps) {
    // Prefill from initialValues if provided (edit), else blanks (create)
    const [selectedGroups, setSelectedGroups] = useState<string[]>(
        initialValues?.groupIds ?? []
    );
    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [description, setDescription] = useState(
        initialValues?.description ?? ""
    );
    const [location, setLocation] = useState(initialValues?.location ?? "");
    const [address, setAddress] = useState(initialValues?.address ?? "");

    const [startValue, setStartValue] = useState<string>(
        initialValues?.start ? toLocalInput(new Date(initialValues.start)) : ""
    );
    const [endValue, setEndValue] = useState<string>(
        initialValues?.end ? toLocalInput(new Date(initialValues.end)) : ""
    );

    const minNow = useMemo(nowLocal, []);
    const endMin = startValue
        ? toLocalInput(
              new Date(new Date(startValue).getTime() + 60 * 60 * 1000)
          )
        : minNow;

    const buttonText =
        submitLabel ?? (mode === "edit" ? "Save Changes" : "Add Event");
    const buttonPending =
        pendingText ?? (mode === "edit" ? "Saving..." : "Adding...");

    const [dirty, setDirty] = useState<string[]>([]);
    const markDirty = (name: string) =>
        setDirty((d) => (d.includes(name) ? d : [...d, name]));

    const isGroupsDirty = dirty.includes("organizingGroups");

    const submitDisabled =
        mode === "edit"
            ? dirty.length === 0 ||
              (isGroupsDirty && selectedGroups.length === 0)
            : selectedGroups.length === 0;

    return (
        <form
            action={onSubmitAction}
            className="space-y-6"
            aria-label="Event Form"
        >
            {initialValues?.eventId && (
                <input
                    type="hidden"
                    name="eventId"
                    value={initialValues.eventId}
                />
            )}

            <input
                type="hidden"
                name="dirty"
                value={
                    mode === "create"
                        ? "title,description,location,address,start,end,organizingGroups"
                        : dirty.join(",")
                }
            />

            {/* Title */}
            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Event Title<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    minLength={3}
                    maxLength={100}
                    autoComplete="off"
                    placeholder="Enter event title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        markDirty("title");
                    }}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                />
            </div>

            {/* Description */}
            <div>
                <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                >
                    Event Description<span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    minLength={10}
                    maxLength={1000}
                    placeholder="Describe the event"
                    rows={4}
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        markDirty("description");
                    }}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                />
            </div>

            {/* Organizers (react-select wrapper) */}
            <div>
                <GroupsSelect
                    organizingGroups={groups}
                    selectedGroups={selectedGroups}
                    onChange={(ids) => {
                        setSelectedGroups(ids);
                        markDirty("organizingGroups");
                    }}
                />
                {/* Hidden inputs so FormData includes them */}
                {selectedGroups.map((id) => (
                    <input
                        key={id}
                        type="hidden"
                        name="organizingGroups"
                        value={id}
                    />
                ))}
                {selectedGroups.length === 0 && (
                    <p className="text-xs lg:text-sm text-gray-500 mt-1 mx-2">
                        You must pick at least one organizing group to submit.
                    </p>
                )}
            </div>

            {/* Location + Address */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label
                        htmlFor="location"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        TMU Building (N/A if not in TMU)
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        required
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        placeholder="Enter event location"
                        value={location}
                        onChange={(e) => {
                            setLocation(e.target.value);
                            markDirty("location");
                        }}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                    />
                </div>
                <div className="flex-1">
                    <label
                        htmlFor="address"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Full Address (Street Address or Online Link)
                        <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        placeholder="Enter event address"
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            markDirty("address");
                        }}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                    />
                </div>
            </div>

            {/* Start/End */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label
                        htmlFor="start"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Start Date & Time<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        id="start"
                        name="start"
                        min={minNow}
                        required
                        value={startValue}
                        onChange={(e) => {
                            const v = e.target.value;
                            markDirty("start");
                            setStartValue(v);
                            // Keep end >= start (+ your UI rule of +1h)
                            const minEnd = toLocalInput(
                                new Date(new Date(v).getTime() + 60 * 60 * 1000)
                            );
                            if (!endValue || endValue < minEnd) {
                                setEndValue(minEnd);
                            }
                        }}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                    />
                </div>
                <div className="flex-1">
                    <label
                        htmlFor="end"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        End Date & Time<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        id="end"
                        name="end"
                        min={endMin}
                        required
                        value={endValue}
                        onChange={(e) => {
                            setEndValue(e.target.value);
                            markDirty("end");
                        }}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                    />
                    {startValue && (
                        <p className="mt-1 text-xs text-gray-500">
                            End time cannot be before{" "}
                            {toLocalInput(
                                new Date(
                                    new Date(startValue).getTime() +
                                        60 * 60 * 1000
                                )
                            ).replace("T", " ")}
                            .
                        </p>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-y-2 justify-center items-center">
                <SubmitButton
                    pendingText={buttonPending}
                    disabled={submitDisabled}
                    className="w-auto px-10 py-2 rounded-lg bg-highlight text-white font-semibold shadow hover:bg-highlight-dark focus:bg-highlight-blue transition disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-75"
                >
                    {buttonText}
                </SubmitButton>
                {(mode === "create" || isGroupsDirty) &&
                    selectedGroups.length === 0 && (
                        <p className="text-xs lg:text-sm text-gray-500 mx-2 text-center">
                            You must pick at least one organizing group to
                            submit.
                        </p>
                    )}
            </div>
        </form>
    );
}
