import { loadContactsView } from "@/views/contacts/api/loadContactsView";
import ContactsView from "@/views/contacts/ui/ContactsView";

export default async function ContactsPage() {
  return <ContactsView {...await loadContactsView()} />;
}
