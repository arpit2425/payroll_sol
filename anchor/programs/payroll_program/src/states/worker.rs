use anchor_lang::prelude::*;
#[account]
#[derive(InitSpace)]
pub struct Worker {
    pub org: Pubkey,
    pub worker_pubkey: Pubkey,
    pub salary: u64,
    pub last_paid_at: u64,
    pub created_at: u64,
    pub bump: u8,
}
