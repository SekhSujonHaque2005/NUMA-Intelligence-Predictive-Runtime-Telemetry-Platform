fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Ensure the proto file exists in the expected location
    tonic_build::compile_protos("../../packages/proto/runtime.proto")?;
    Ok(())
}
