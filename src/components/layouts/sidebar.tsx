import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "~/components/ui";
import { useLocation } from "@solidjs/router";
import { LayoutDashboard } from "lucide-solid";
import { createMemo } from "solid-js";

// Importar los nuevos componentes de iconos
import HelmIcon from "~/components/icons/HelmIcon";
import KubernetesIcon from "~/components/icons/KubernetesIcon";
import RancherIcon from "~/components/icons/RancherIcon";
import GithubIcon from "~/components/icons/GithubIcon";
import DockerIcon from "~/components/icons/DockerIcon";

// Configuración de rutas para mejor mantenimiento
const routeConfig = {
    home: { path: "/", exact: true },
    helm: { path: "/cluster/helm", exact: false },
    deployments: { path: "/cluster/deployments", exact: false },
    rke2: { path: "/cluster/rke2", exact: false },
    github: { path: "/repositories/github", exact: false },
    docker: { path: "/repositories/docker", exact: false }
} as const;

const SidebarApp = () => {
    const location = useLocation();

    // Helper function mejorada para detectar rutas activas
    const isRouteActive = createMemo(() => {
        const pathname = location.pathname;
        
        return Object.entries(routeConfig).reduce((acc, [key, config]) => {
            const isActive = config.exact 
                ? pathname === config.path
                : pathname.startsWith(config.path);
            
            return { ...acc, [key]: isActive };
        }, {} as Record<keyof typeof routeConfig, boolean>);
    });

    return (
        <>
            <Sidebar variant="sidebar">
                <SidebarHeader>
                    header
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/" isActive={isRouteActive().home}>
                                        <LayoutDashboard />
                                        <span>Home</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            <span>Clusters</span>
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton href="/cluster/helm" isActive={isRouteActive().helm}>
                                        <HelmIcon class="size-4" aria-hidden="true" />
                                        <span>Helm</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        href="/cluster/deployments"
                                        isActive={isRouteActive().deployments}
                                    >
                                        <KubernetesIcon class="size-4" aria-hidden="true" />
                                        <span>Deployments</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        href="/cluster/rke2"
                                        isActive={isRouteActive().rke2}
                                    >
                                        <RancherIcon class="size-4" aria-hidden="true" />
                                        <span>RKE2</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    <SidebarGroup>
                        <SidebarGroupLabel>
                            Repositories
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        href="/repositories/github"
                                        isActive={isRouteActive().github}
                                    >
                                        <GithubIcon class="size-4" aria-hidden="true" />
                                        <span>Github</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        href="/repositories/docker"
                                        isActive={isRouteActive().docker}
                                    >
                                        <DockerIcon class="size-4" aria-hidden="true" />
                                        <span>Docker</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    user
                </SidebarFooter>
            </Sidebar>
        </>
    );
};

export { SidebarApp };