import { Suspense, type Component, type JSX } from 'solid-js';
import { Toaster } from "solid-sonner";
import { I18nProvider } from "@kobalte/core";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger
} from "~/components/ui";
import { SidebarApp } from "~/components/layouts/sidebar";

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
                            <Suspense>{props.children}</Suspense>
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </I18nProvider>
        </>
    );
};

export default App;
