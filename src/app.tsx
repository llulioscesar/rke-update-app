import {Suspense, type Component} from 'solid-js';
import {A, useLocation} from '@solidjs/router';
import {Toaster} from "solid-sonner";
import {I18nProvider} from "@kobalte/core";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger
} from "~/components/ui";
import {SidebarApp} from "~/components/layouts/sidebar";

const App: Component = (props: { children: Element }) => {
    return (
        <>
            <I18nProvider locale="es-CO">
                <Toaster/>
                <SidebarProvider>
                    <SidebarApp/>
                    <SidebarInset>
                        <header class="flex h-16 shrink-0 items-center gap-2">
                            <SidebarTrigger/>
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
