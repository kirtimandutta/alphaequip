export function FrameCorners() {
  const corner = "pointer-events-none absolute h-5 w-5 border-yellow-400/80";
  return (
    <>
      <span className={`${corner} left-3 top-3 border-l border-t`} />
      <span className={`${corner} right-3 top-3 border-r border-t`} />
      <span className={`${corner} bottom-3 left-3 border-b border-l`} />
      <span className={`${corner} bottom-3 right-3 border-b border-r`} />
    </>
  );
}
