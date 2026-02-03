import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Song } from "@/types";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errors";

interface AIStore {
	generatedPlaylist: Song[];
	isLoading: boolean;
	error: string | null;
	generatePlaylist: (prompt: string) => Promise<void>;
	reset: () => void;
}

export const useAIStore = create<AIStore>((set) => ({
	generatedPlaylist: [],
	isLoading: false,
	error: null,

	generatePlaylist: async (prompt: string) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.post("/ai/generate", { prompt });
			set({ generatedPlaylist: response.data.songs, isLoading: false });
			toast.success("Playlist generated!");
		} catch (error) {
			const errorMsg = getErrorMessage(error, "Failed to generate playlist");
			set({ error: errorMsg, isLoading: false });
			toast.error(errorMsg);
		}
	},

	reset: () => set({ generatedPlaylist: [], error: null }),
}));
