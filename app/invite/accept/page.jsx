"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from "@/hooks/useAuth";

const STATUS = {
  CHECKING: "checking",
  PROCESSING: "processing",
  SUCCESS: "success",
  ERROR: "error",
};

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState(STATUS.CHECKING);
  const [message, setMessage] = useState("");
  const hasCalled = useRef(false);

  const { user, isLoading } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus(STATUS.ERROR);
      setMessage("This invite link is invalid or incomplete.");
      return;
    }

    if (isLoading) return;

    if (!user) {
      router.push(
        `/signin?redirect=${encodeURIComponent(
          `/invite/accept?token=${token}`
        )}`
      );
      return;
    }

    if (hasCalled.current) return;
    hasCalled.current = true;

    const processInvite = async () => {
      try {
        setStatus(STATUS.PROCESSING);

        const functions = getFunctions(undefined, "asia-south2");

        const acceptInvite = httpsCallable(
          functions,
          "acceptFriendInvite"
        );

        const result = await acceptInvite({ token });

        if (result.data?.success) {
          setStatus(STATUS.SUCCESS);
          setMessage(
            result.data.message || "Invite accepted successfully!"
          );

          setTimeout(() => {
            router.push("/dashboard");
          }, 2500);
        } else {
          setStatus(STATUS.ERROR);
          setMessage("Failed to process invitation.");
        }
      } catch (error) {
        console.error("Firebase Function Error:", error);

        setStatus(STATUS.ERROR);

        const code = error?.code?.replace("functions/", "");

        const errorMessages = {
          "not-found":
            "This invite link is invalid or has expired.",
          "failed-precondition":
            "This invite has already been accepted.",
          "deadline-exceeded":
            "This invite link has expired.",
          "invalid-argument":
            "You cannot accept your own invitation.",
          "permission-denied":
            "This invitation was sent to a different email address.",
          unauthenticated:
            "Please sign in to accept this invitation.",
        };

        setMessage(
          errorMessages[code] ||
          error.message ||
          "Something went wrong. Please try again."
        );
      }
    };

    processInvite();
  }, [searchParams, router, user, isLoading]);

  const isloading = status === STATUS.CHECKING || status === STATUS.PROCESSING;

  return (
    <div
      style={{ backgroundColor: "var(--color-bg)" }}
      className="min-h-screen flex items-center justify-center px-6"
    >
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
        className="rounded-2xl p-10 w-full max-w-sm"
      >

        {/* Brand */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: "var(--color-icon-success-bg)",
                border: "1px solid var(--color-icon-success-border)",
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2a10 10 0 100 20A10 10 0 0012 2zm1 14h-2v-4H7l5-5 5 5h-4v4z"
                  fill="var(--color-icon-success)"
                />
              </svg>
            </div>
            <div>
              <p
                style={{ color: "var(--color-text)" }}
                className="text-base font-semibold font-serif tracking-tight leading-none"
              >
                SevaMed
              </p>
              <p
                style={{ color: "var(--color-text-subtle)" }}
                className="text-[11px] uppercase tracking-widest mt-0.5"
              >
                Medical Records
              </p>
            </div>
          </div>
          <span
            style={{
              color: "var(--color-badge-text)",
              backgroundColor: "var(--color-badge-bg)",
              border: "1px solid var(--color-badge-border)",
            }}
            className="text-[11px] rounded-md px-2.5 py-1 tracking-wide"
          >
            Invite
          </span>
        </div>

        <hr style={{ borderColor: "var(--color-border)" }} className="mb-8" />

        {/* Loading */}
        {isloading && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              style={{
                backgroundColor: "var(--color-icon-loading-bg)",
                border: "1px solid var(--color-icon-loading-border)",
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
            >
              <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="var(--color-icon-loading-border)" strokeWidth="1.5" />
                <path
                  d="M12 3a9 9 0 0 1 9 9"
                  stroke="var(--color-icon-loading-stroke)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2
              style={{ color: "var(--color-text)" }}
              className="text-lg font-semibold font-serif"
            >
              {status === STATUS.CHECKING ? "Verifying invite" : "Processing invitation"}
            </h2>
            <p style={{ color: "var(--color-text-muted)" }} className="text-sm leading-relaxed">
              {status === STATUS.CHECKING
                ? "Checking your invitation link. This only takes a moment."
                : "Please wait while we set up access."}
            </p>
            <div
              style={{ backgroundColor: "var(--color-progress-track)" }}
              className="w-full h-px rounded-full overflow-hidden"
            >
              <div
                style={{ backgroundColor: "var(--color-progress-fill)" }}
                className="h-full w-3/5 rounded-full animate-pulse"
              />
            </div>
          </div>
        )}

        {/* Success */}
        {status === STATUS.SUCCESS && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              style={{
                backgroundColor: "var(--color-icon-success-bg)",
                border: "1px solid var(--color-icon-success-border)",
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="var(--color-icon-success)" strokeWidth="1.5" />
                <path
                  d="M8 12l3 3 5-5"
                  stroke="var(--color-icon-success)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 style={{ color: "var(--color-text)" }} className="text-lg font-semibold font-serif">
              Access granted
            </h2>
            <p style={{ color: "var(--color-text-muted)" }} className="text-sm leading-relaxed">
              {message}
            </p>
            <p style={{ color: "var(--color-text-subtle)" }} className="text-xs tracking-wide">
              Redirecting you automatically…
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                backgroundColor: "var(--color-btn-primary-bg)",
                color: "var(--color-btn-primary-text)",
              }}
              className="mt-1 w-full py-3 font-medium text-sm rounded-lg transition-opacity hover:opacity-80"
            >
              Continue to dashboard
            </button>
          </div>
        )}

        {/* Error */}
        {status === STATUS.ERROR && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              style={{
                backgroundColor: "var(--color-icon-error-bg)",
                border: "1px solid var(--color-icon-error-border)",
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="var(--color-icon-error)" strokeWidth="1.5" />
                <path
                  d="M12 8v4M12 16h.01"
                  stroke="var(--color-icon-error)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 style={{ color: "var(--color-text)" }} className="text-lg font-semibold font-serif">
              Invite failed
            </h2>
            <p style={{ color: "var(--color-text-muted)" }} className="text-sm leading-relaxed">
              {message}
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              style={{
                backgroundColor: "var(--color-btn-primary-bg)",
                color: "var(--color-btn-primary-text)",
              }}
              className="mt-1 w-full py-3 font-medium text-sm rounded-lg transition-opacity hover:opacity-80"
            >
              Back to dashboard
            </button>
          </div>
        )}

        <hr style={{ borderColor: "var(--color-border)" }} className="mt-8 mb-4" />
        <p style={{ color: "var(--color-text-subtle)" }} className="text-center text-[11px]">
          Need help? Contact your account administrator.
        </p>
      </div>
    </div>
  );
}