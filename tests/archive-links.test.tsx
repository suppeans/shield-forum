import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ArchiveLinks } from "@/components/archive-links";

afterEach(cleanup);
const dates = Array.from({ length: 12 }, (_, index) => `2026-10-${String(26 - index).padStart(2, "0")}`);

describe("brief archives", () => {
  it.each([0, 8, 12])("shows at most eight links for %i dates and keeps older dates selectable", (count) => {
    render(<ArchiveLinks dates={dates.slice(0, count)} />);
    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(Math.min(8, count));
    links.forEach((link, index) => expect(link).toHaveAttribute("href", `/?date=${dates[index]}`));
    if (count <= 8) {
      expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    } else {
      const select = screen.getByRole("combobox", { name: "以前のブリーフ" });
      expect(select).toHaveAttribute("name", "date");
      expect(select.closest("form")).toHaveAttribute("action", "/");
      expect(within(select).getAllByRole("option").slice(1).map(option => option.getAttribute("value"))).toEqual(dates.slice(8, count));
    }
  });

  it("shows the currently selected older brief in the dropdown", () => {
    render(<ArchiveLinks dates={dates} selected={dates[9]} />);
    expect(screen.getByRole("combobox")).toHaveValue(dates[9]);
  });
});
