import { loadContactsView } from "@/views/contacts/api/loadContactsView";
import ContactsView from "@/views/contacts/ui/ContactsView";

/**
 * /contacts: contacts, the callback form and the Instagram section.
 */
export default async function ContactsPage() {
  return <ContactsView {...await loadContactsView()} />;
}
