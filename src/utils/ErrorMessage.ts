export class ErrorMessage {
  /**
   * Hata nesnesinden anlamlı bir mesaj döndürür.
   * @param error - Backend'den veya frontend'den gelen hata nesnesi
   */
  static get(error: unknown): string {
    // Axios veya fetch ile gelen backend hatası
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as any).response === "object"
    ) {
      const response = (error as any).response;
      if (response.data && typeof response.data.message === "string") {
        return response.data.message;
      }
      if (typeof response.data === "string") {
        return response.data;
      }
    }

    // Standart JS Error nesnesi
    if (error instanceof Error && error.message) {
      return error.message;
    }

    // String olarak gelen hata
    if (typeof error === "string") {
      return error;
    }

    // Bilinmeyen hata
    return "Bilinmeyen bir hata oluştu.";
  }
}