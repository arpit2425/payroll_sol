use anchor_lang::prelude::*;
mod errors;
mod instructions;
mod states;
pub use instructions::add_worker::*;
pub use instructions::create_org::*;
pub use instructions::fund_treasury::*;
pub use instructions::process_payroll::*;
pub use instructions::withdraw::*;
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
    pub fn fund_treasury(ctx: Context<FundTreasury>, amount: u64) -> Result<()> {
        instructions::fund_treasury::fund_treasury(ctx, amount)
    }
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        instructions::withdraw::withdraw(ctx, amount)
    }
    pub fn process_payroll<'info>(ctx: Context<'info, ProcessPayroll<'info>>, cycle_timestamp: u64) -> Result<()> {
        instructions::process_payroll::process_payroll(ctx, cycle_timestamp)
    }
}
