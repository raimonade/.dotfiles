return {
	{
		"nvim-tree/nvim-web-devicons",
		config = function()
			require("nvim-web-devicons").setup({
				override = {
					gleam = {
						icon = "",
						color = "#ffaff3",
						name = "Gleam",
					},
				},
			})
		end,
	},
}
