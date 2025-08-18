import { Suspense, type Component, type JSX } from 'solid-js';
import { Toaster } from "solid-sonner";
import { I18nProvider } from "@kobalte/core";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger, Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage
} from "~/components/ui";
import { SidebarApp } from "~/components/layouts/sidebar";
import {DropdownMenu} from "@kobalte/core/dropdown-menu";

const App: Component<{ children: JSX.Element }> = (props) => {
    return (
        <>
            <I18nProvider locale="es-CO">
                <Toaster />
                <SidebarProvider>
                    <SidebarApp />
                    <SidebarInset>
                        <header class="flex h-16 shrink-0 items-center gap-2">
                            <SidebarTrigger />
                            <div class="ml-auto">
                                {/* Espacio para otros elementos del header */}
                            </div>
                        </header>
                        <main class="flex-1 flex flex-col overflow-hidden">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <a href="/">Home</a>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <DropdownMenu>
                                            aaaaaaaa
                                        </DropdownMenu>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <a href="/docs/components">Components</a>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <Suspense>{props.children}</Suspense>
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </I18nProvider>
        </>
    );
};

export default App;
