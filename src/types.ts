export enum RequestType {
  EVALUATE_ARTICLE = "evaluate_article",
  GENERATE_COMMENT_WAVE = "generate_comment_wave",
  TRIGGER_ENDING = "trigger_ending",
}

export interface WorldState {
  public_tension: number;
  media_trust: number;
  political_pressure: number;
  misinformation_spread: number;
  economic_anxiety: number;
  institutional_trust: number;
  public_sentiment_toward_subject: number;
}

export interface ChainReaction {
  id: string;
  trigger: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "CATASTROPHIC";
  affects: string[];
  resolves_in: number;
  escalation_path: string;
  status?: "ESCALATING" | "STABLE" | "RESOLVING" | "RESOLVED" | "CRITICAL";
  update?: string;
}

export interface PlayerStats {
  credibility_score: number;
  reputation: string;
  articles_published: number;
  accuracy_history: number[];
}

export interface Evidence {
  id: string;
  category: string;
  title: string;
  source: string;
  reliability: string;
  content: string;
  truth_contribution: number;
  asset: string;
  pages?: string[];
  hidden_truth?: string;
  initially_visible: boolean;
}

export interface EvidenceUnlock {
  should_unlock: boolean;
  evidence_ids: string[];
  unlock_narrative: string;
}

export interface KeyActor {
  id: string;
  name: string;
  role: string;
  initial_public_stance: string;
  asset: string;
  secret?: string;
}

export interface GameIssue {
  case_id: number;
  title: string;
  brief: string;
  status: string;
  sensitivity: string;
  assets: {
    case_thumbnail: string;
    brief_document_scan: string;
    location_map: string;
  };
  evidence_files: Evidence[];
  key_actors: KeyActor[];
  initial_world_state: WorldState;
  active_chain_reactions: ChainReaction[];
  opening_narrative: string;
  first_article_prompt: string;
}

export interface Evaluation {
  headline_score?: number;
  accuracy_score: number;
  balance_score: number;
  impact_score: number;
  truth_contribution: number;
  narrative_feedback: string;
  new_world_state: WorldState;
  new_player_stats: PlayerStats;
  triggered_chain_reactions: ChainReaction[];
}

export interface SocialMediaComment {
  username: string;
  handle?: string;
  avatar_initial: string;
  avatar_color: string;
  verified: boolean;
  follower_tier?: string;
  content: string;
  likes: number;
  reposts?: number;
  sentiment: string;
  reply_to: string | null;
}

export interface SocialMediaPlatform {
  platform_name: string;
  platform_type: string;
  ui_hint: string;
  comments: SocialMediaComment[];
}

export interface EvaluationResponse {
  evaluation: Evaluation;
  social_media_updates?: Record<string, SocialMediaComment[]>;
  ending_check: {
    should_trigger_ending: boolean;
    ending_type: string | null;
    trigger_reason: string | null;
  };
  evidence_unlock: EvidenceUnlock;
  next_article_brief?: {
    info: string;
    suggested_angle: string;
  };
}
