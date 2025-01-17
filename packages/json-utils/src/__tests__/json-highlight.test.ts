import { getJsonContainer, highlightJSON } from "../json-highlight";

describe("json highlight functions", () => {
  describe("highlightJSON", () => {
    it("should format a string value", () => {
      const result = highlightJSON("hello");
      expect(result).toBe('<span class="value">"hello"</span>');
    });

    it("should format a number value", () => {
      const result = highlightJSON(123);
      expect(result).toBe('<span class="value">123</span>');
    });

    it("should format a null value", () => {
      const result = highlightJSON(null);
      expect(result).toBe('<span class="value">null</span>');
    });

    it("should format a boolean values", () => {
      const result = highlightJSON(true);
      expect(result).toBe('<span class="value">true</span>');
    });

    it("should format an object", () => {
      const result = highlightJSON({ key: "value", num: 123 });
      expect(result).toMatchSnapshot();
    });

    it("should format nested objects and arrays", () => {
      const result = highlightJSON({
        obj: { key: "value" },
        arr: [1, 2, { nested: "deep" }],
      });
      expect(result).toMatchSnapshot();
    });

    it("should format nested objects and arrays", () => {
      const result = highlightJSON({
        obj: { key: "value" },
        arr: [1, 2, { nested: "deep" }],
      });
      expect(result).toMatch(/<span class="bracket">{<\/span>/);
      expect(result).toMatch(/<span class="key">"obj"<\/span>:/);
      expect(result).toMatch(/<span class="value">"value"<\/span>/);
      expect(result).toMatch(/<span class="key">"nested"<\/span>/);
      expect(result).toMatch(/<span class="bracket">\[<\/span>/);
    });
  });

  describe("getJsonContainer", () => {
    it("should wrap highlighted JSON in a container", () => {
      const json = { key: "value" };
      const result = getJsonContainer(json);
      expect(result).toContain('<section class="json-container">');
      expect(result).toContain('<div class="json">');
      expect(result).toContain(
        '<span class="key">"key"</span>: <span class="value">"value"</span>'
      );
    });

    it("should work with an empty object", () => {
      const json = {};
      const result = getJsonContainer(json);
      expect(result).toContain('<section class="json-container">');
      expect(result).toContain('<span class="bracket">{</span>');
      expect(result).toContain('<span class="bracket">}</span>');
    });

    it("should work with an empty array", () => {
      const json: any[] = [];
      const result = getJsonContainer(json);
      expect(result).toContain('<section class="json-container">');
      expect(result).toContain('<span class="bracket">[</span>');
      expect(result).toContain('<span class="bracket">]</span>');
    });
  });
});
