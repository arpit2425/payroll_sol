use anchor_lang::prelude::*;
mod errors;
mod instructions;
mod states;
pub use instructions::add_worker::*;
pub use instructions::create_org::*;
declare_id!("Hv6mkobFWeU5hhrVkfimUEFerhYYmvkZkiyFxLn6V9P9");

#[program]
pub mod payroll_program {
    use super::*;
    pub fn create_org(ctx: Context<CreateOrg>, name: String) -> Result<()> {
        instructions::create_org::create_org(ctx, name)
    }
    pub fn add_worker(ctx: Context<AddWorker>, salary: u64) -> Result<()> {
        instructions::add_worker::add_worker(ctx, salary)
    }
}
