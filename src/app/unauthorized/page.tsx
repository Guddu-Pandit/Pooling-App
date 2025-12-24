export default function UnauthorizedPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-red-500">403</h1>
        <p className="text-lg">You are not authorized to access this page</p>
      </div>
    </div>
  );
}
