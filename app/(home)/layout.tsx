import type { ReactNode } from "react";
import { HomeLayout } from "@/components/layout/home";
import { getLinks } from "@/components/layout/shared";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { baseOptions, linkItems } from "../layout.config";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <HomeLayout
      {...baseOptions}
      links={linkItems}
      nav={{
        component: (
          <Header
            finalLinks={getLinks(linkItems, baseOptions.githubUrl)}
            {...baseOptions}
          />
        ),
      }}
      className="pt-0"
    >
      <main className="bg-background flex flex-1 flex-col divide-y divide-dashed divide-border border-dashed border-border sm:border-b">
        {children}
        <Footer />
      </main>
    </HomeLayout>
  );
};

export default Layout;
