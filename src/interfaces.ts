/**
 * Represents a single element of the FizzbuzzList.
 *
 * @remarks
 * We use this interface instead of a simple string array to be able to track the elements in the list.
 * This results in better performance when rendering the list in the UI.
 */
export interface FizzbuzzListElement {
  /** A uniqueId that will serve as the "trackby" element in the for loop that renders the FizzbuzzList.  */
  uniqueId: string;

  /** The actual of the element. Numbers are also simply passed as strings. */
  value: string;
}
