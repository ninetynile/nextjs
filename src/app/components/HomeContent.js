// components/HomeContent.js
// This component should be a Server Component by default unless you need hooks/browser APIs.
"use client";
export default function HomeContent() {
  return (
    <div>
      <h2>Welcome Home!</h2>
      <p>This is the main dashboard content visible when Home is selected.</p>
    </div>
  );
}