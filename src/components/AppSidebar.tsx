import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroup,
  SidebarGroupLabel,

} from "@/components/ui/sidebar"
import { prisma } from "@/db/prisma"
import { Note } from "@prisma/client"
// TODO: Implement actual user authentication logic
// This is a placeholder implementation
export async function getUser(): Promise<{ id: string } | null> {
  return null;
}
import Link from "next/link"

async function AppSidebar() {
    const user = await getUser()

    let notes: Note[] = []
    if (user) {
      notes = await prisma.note.findMany({ 
        where: { 
             authorId: user.id 
        },
        orderBy: {
                updatedAt: "desc"
        }
      })
    }

  return (
    <Sidebar>

      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {user ? (
              "Your Notes"
            ) : (
              <p>
                <Link href="/login" className="underline">
                  Login
                </Link>{" "}
                to see your notes
              </p>
            )}
          </SidebarGroupLabel>
          {user && (
            <SidebarGroupContent>
              {notes.map((note) => (
                <div key={note.id} className="p-2">
                  <Link href={`/notes/${note.id}`} className="block hover:bg-gray-100 rounded p-2">
                    {note.text.slice(0, 50)}{note.text.length > 50 ? '...' : ''}
                  </Link>
                </div>
              ))}
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar