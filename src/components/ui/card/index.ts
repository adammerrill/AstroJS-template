/**
 * @file Card Public API
 * @module components/ui/card
 * @classification Public
 * @compliance ISO/IEC 25010 - Modularity & Component Composition
 * @author Atom Merrill
 * @version 2.0.0
 * @requirement REQ-SYS-001
 * @requirement REQ-ARCH-003 - Compound Component Pattern
 * @test_ref src/components/ui/card/card.test.ts
 * 
 * @description
 * Barrel export for Card compound component system. Exposes 7 sub-components for flexible composition.
 *
 * @description Pattern:
 * - **Card**: Root container with border/shadow styles
 * - **CardHeader**: Top section with title/description/actions
 * - **CardContent**: Body content area
 * - **CardFooter**: Bottom section for actions
 * - **CardTitle/Description**: Typography primitives
 * - **CardAction**: Slot for contextual actions (edit, delete, etc.)
 */

import Root from "./card.svelte";
import Content from "./card-content.svelte";
import Description from "./card-description.svelte";
import Footer from "./card-footer.svelte";
import Header from "./card-header.svelte";
import Title from "./card-title.svelte";
import Action from "./card-action.svelte";

export {
  Root,
  Content,
  Description,
  Footer,
  Header,
  Title,
  Action,
  // Aliases
  Root as Card,
  Content as CardContent,
  Description as CardDescription,
  Footer as CardFooter,
  Header as CardHeader,
  Title as CardTitle,
  Action as CardAction,
};
