export type PipelineConfig = {

    /**
     * The path to the pipeline file to use
     * (default: './pipeline.json')
     */
    pipelineFile: string;

    /**
     * The path to the workspace directory
     * The workspace directory is used to store temporary files
     * (default: './workspace/')
     */
    workspaceDir: string;

    /**
     * The path to the input files directory
     * (default: './resources/input/')
     */
    inputDir: string;

    /**
     * The path to the output files directory
     * (default: './resources/output/')
     */
    outputDir: string;

}