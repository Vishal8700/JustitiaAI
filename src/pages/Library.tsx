import DesktopLayout from "@/components/DesktopLayout";

const Library = () => {
  return (
    <DesktopLayout>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Library</h1>
          <p className="text-muted-foreground">Access your saved conversations and resources</p>
        </div>
      </div>
    </DesktopLayout>
  );
};

export default Library;