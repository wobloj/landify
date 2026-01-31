"use client";

import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState } from "react";
import { Loader2, Plus, ExternalLink, Settings, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

type Site = {
  id: number;
  site_slug: string;
  app_title: string;
  plan: string;
  is_published: boolean;
  created_at: string;
};

type DashboardPanelProps = {
  sites: Site[];
  maxSites: number;
  onCreateSite: () => Promise<void>;
  onDeleteSite: (siteId: number) => Promise<void>;
};

export default function DashboardPanel({
  sites,
  maxSites,
  onCreateSite,
  onDeleteSite,
}: DashboardPanelProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const canAddSite = sites.length < maxSites;

  const handleCreateSite = async () => {
    if (!canAddSite) return;

    setCreating(true);
    try {
      await onCreateSite();
    } catch (error) {
      console.error("Error creating site:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSite = async (siteId: number) => {
    setDeleting(siteId);
    try {
      await onDeleteSite(siteId);
    } catch (error) {
      console.error("Error deleting site:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleEditSite = (siteId: number) => {
    router.push(`/admin?siteId=${siteId}`);
  };

  return (
    <div className="px-20 py-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Moje strony</h1>
          <p className="text-muted-foreground">
            {sites.length} / {maxSites} stron wykorzystanych
          </p>
        </div>

        <Button
          onClick={handleCreateSite}
          disabled={!canAddSite || creating}
          size="lg"
          className="cursor-pointer"
        >
          {creating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Tworzenie...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj stronę
            </>
          )}
        </Button>
      </div>

      {!canAddSite && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Osiągnąłeś limit stron dla swojego planu.
            <Button variant="link" className="p-0 ml-1 h-auto">
              Zmień plan aby dodać więcej stron.
            </Button>
          </p>
        </div>
      )}

      {sites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Brak stron</h2>
          <p className="text-muted-foreground mb-6">
            Rozpocznij swoją przygodę tworząc pierwszą stronę
          </p>
          <Button onClick={handleCreateSite} disabled={creating} size="lg">
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Tworzenie...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Utwórz pierwszą stronę
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <Card
              key={site.id}
              className="flex flex-col aspect-video hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl">{site.app_title}</CardTitle>
                  <Badge variant={site.is_published ? "default" : "secondary"}>
                    {site.is_published ? "Opublikowana" : "Szkic"}
                  </Badge>
                </div>
                <CardDescription>/{site.site_slug}</CardDescription>
              </CardHeader>

              <CardFooter className="mt-auto flex gap-2">
                <Button
                  variant="default"
                  className="flex-1 cursor-pointer"
                  onClick={() => handleEditSite(site.id)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edytuj
                </Button>

                {site.is_published && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(`/${site.site_slug}`, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={deleting === site.id}
                    >
                      {deleting === site.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Czy na pewno?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ta akcja jest nieodwracalna. Strona "{site.app_title}"
                        zostanie trwale usunięta wraz ze wszystkimi danymi.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Anuluj</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteSite(site.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Usuń stronę
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
