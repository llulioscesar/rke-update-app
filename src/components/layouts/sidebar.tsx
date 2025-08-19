import {
    Collapsible, CollapsibleContent, CollapsibleTrigger,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem
} from "~/components/ui";
import {A, useLocation} from "@solidjs/router";
import {LayoutDashboard} from "lucide-solid";
import {createMemo} from "solid-js";

// Importar los nuevos componentes de iconos
import HelmIcon from "~/components/icons/HelmIcon";
import KubernetesIcon from "~/components/icons/KubernetesIcon";
import RancherIcon from "~/components/icons/RancherIcon";
import GithubIcon from "~/components/icons/GithubIcon";
import DockerIcon from "~/components/icons/DockerIcon";

// Configuración de rutas para mejor mantenimiento
const routeConfig = {
    home: {path: "/", exact: true},
    helm: {path: "/cluster/helm", exact: false},
    deployments: {path: "/cluster/deployments", exact: false},
    rke2: {path: "/cluster/rke2", exact: false},
    github: {path: "/repositories/github", exact: false},
    docker: {path: "/repositories/docker", exact: false}
} as const;

const SidebarApp = () => {
    const location = useLocation();

    // Helper function mejorada para detectar rutas activas
    const activeRoute = createMemo(() => {
        const pathname = location.pathname;

        for (const [key, config] of Object.entries(routeConfig)) {
            if (config.exact) {
                // home solo se activa si es exactamente "/"
                if (pathname === config.path) return key;
            } else {
                // demás rutas aceptan prefijo
                if (pathname === config.path || pathname.startsWith(config.path + "/")) {
                    return key;
                }
            }
        }

        return null;
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
                                    <SidebarMenuButton isActive={activeRoute() === 'home'} asChild>
                                        {(p) => (
                                            <A {...p} href={routeConfig.home.path}>
                                                <LayoutDashboard/>
                                                <span>Home</span>
                                            </A>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <Collapsible defaultOpen class="group/collapsible">
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            {(props) => (
                                                <SidebarMenuButton {...props}>
                                                    RKE2
                                                </SidebarMenuButton>
                                            )}
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuSubItem>
                                                    Helm
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
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
                                    <SidebarMenuButton asChild isActive={activeRoute() === 'helm'}>
                                        {(p) => (
                                            <A href={routeConfig.helm.path} {...p}>
                                                <HelmIcon class="size-4" aria-hidden="true"/>
                                                <span>Helm</span>
                                            </A>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={activeRoute() === 'deployments'}
                                    >
                                        {(p) => (
                                            <A href={routeConfig.deployments.path} {...p}>
                                                <KubernetesIcon class="size-4" aria-hidden="true"/>
                                                <span>Deployments</span>
                                            </A>
                                        )}

                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={activeRoute() === 'rke2'}
                                    >
                                        {(p) => (
                                            <A href={routeConfig.rke2.path} {...p}>
                                                <RancherIcon class="size-4" aria-hidden="true"/>
                                                <span>RKE2</span>
                                            </A>
                                        )}
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
                                        asChild
                                        isActive={activeRoute() === 'github'}
                                    >
                                        {(p) => (
                                            <A href={routeConfig.github.path} {...p}>
                                                <GithubIcon class="size-4" aria-hidden="true"/>
                                                <span>Github</span>
                                            </A>
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={activeRoute() === 'docker'}
                                    >
                                        {(p) => (
                                            <A href={routeConfig.docker.path} {...p}>
                                                <DockerIcon class="size-4" aria-hidden="true"/>
                                                <span>Docker</span>
                                            </A>
                                        )}
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

export {SidebarApp};