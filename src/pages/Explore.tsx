import DesktopLayout from "@/components/DesktopLayout";

const Explore = () => {
  return (
    <DesktopLayout>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Explore</h1>
          <p className="text-muted-foreground">Discover new AI capabilities and features</p>
        </div>
      </div>
    </DesktopLayout>
  );
};

export default Explore;