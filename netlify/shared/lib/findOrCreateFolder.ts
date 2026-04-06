export const findOrCreateFolder = async (
  folderName: string,
  accessToken: string,
  parentId?: string,
): Promise<string | null> => {
  try {
    const parentQuery = parentId ? ` and '${parentId}' in parents` : "";
    const searchResponse = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false${parentQuery}&fields=files(id,name)`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!searchResponse.ok) {
      console.error("[findOrCreateFolder] Failed to search for folder");
      return null;
    }

    const searchData = await searchResponse.json();

    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    const body: any = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };

    if (parentId) {
      body.parents = [parentId];
    }

    const createResponse = await fetch(
      "https://www.googleapis.com/drive/v3/files",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!createResponse.ok) {
      console.error("Failed to create folder");
      return null;
    }

    const createData = await createResponse.json();

    return createData.id;
  } catch (error) {
    console.error("[findOrCreateFolder] Error finding/creating folder:", error);
    return null;
  }
};
