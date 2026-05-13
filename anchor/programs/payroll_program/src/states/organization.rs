use anchor_lang::prelude::*;
#[account]
#[derive(InitSpace)]
pub struct Organization {
    pub authority: Pubkey,
    #[max_len(100)]
    pub name: String,
    pub treasury: u64,
    pub worker_count: u64,
    pub created_at: u64,
    pub bump: u8,
}
