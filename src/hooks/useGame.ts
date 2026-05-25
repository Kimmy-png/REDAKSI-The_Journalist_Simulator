import { useState, useCallback, useEffect } from "react";
import { 
  GameIssue, 
  WorldState, 
  ChainReaction, 
  PlayerStats, 
  RequestType, 
  EvaluationResponse,
  SocialMediaPlatform,
  Evaluation,
  Evidence
} from "../types";
import { callGameAI } from "../services/geminiService";
import { ZENITH_CASE } from "../data/cases";

const STORAGE_KEY = 'kingsway_zenith_save_v1';

export const useGame = () => {
  const [booted, setBooted] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<GameIssue | null>(null);
  const [evidencePool, setEvidencePool] = useState<Evidence[]>([]);
  const [worldState, setWorldState] = useState<WorldState | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [truthExposure, setTruthExposure] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unlockNotification, setUnlockNotification] = useState<{message: string, ids: string[]} | null>(null);
  const [socialPlatforms, setSocialPlatforms] = useState<Record<string, SocialMediaPlatform>>({
    nusantaraX: { platform_name: "NusantaraX", platform_type: "microblogging", ui_hint: "", comments: [] },
    forumNusantara: { platform_name: "ForumNusantara", platform_type: "forum", ui_hint: "", comments: [] },
    kabarnesia: { platform_name: "Kabarnesia", platform_type: "social_feed", ui_hint: "", comments: [] }
  });

  const [endingData, setEndingData] = useState<any | null>(null);

  // Load game state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setCurrentIssue(data.currentIssue);
        setEvidencePool(data.evidencePool);
        setWorldState(data.worldState);
        setPlayerStats(data.playerStats);
        setTruthExposure(data.truthExposure);
        setArticleCount(data.articleCount);
        setSocialPlatforms(data.socialPlatforms);
        setEndingData(data.endingData);
        setEvaluation(data.evaluation);
      } catch (e) {
        console.error("Failed to load save:", e);
      }
    }
    setBooted(true);
  }, []);

  // Save game state whenever relevant state changes
  useEffect(() => {
    if (!booted) return;
    
    const dataToSave = {
      currentIssue,
      evidencePool,
      worldState,
      playerStats,
      truthExposure,
      articleCount,
      socialPlatforms,
      endingData,
      evaluation
    };
    
    // Only save if we actually have a game in progress
    if (currentIssue) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [currentIssue, evidencePool, worldState, playerStats, truthExposure, articleCount, socialPlatforms, endingData, evaluation, booted]);

  const resetGame = useCallback(() => {
    setCurrentIssue(null);
    setEvidencePool([]);
    setWorldState(null);
    setPlayerStats(null);
    setTruthExposure(0);
    setArticleCount(0);
    setEvaluation(null);
    setEndingData(null);
    setSocialPlatforms({
      nusantaraX: { platform_name: "NusantaraX", platform_type: "microblogging", ui_hint: "", comments: [] },
      forumNusantara: { platform_name: "ForumNusantara", platform_type: "forum", ui_hint: "", comments: [] },
      kabarnesia: { platform_name: "Kabarnesia", platform_type: "social_feed", ui_hint: "", comments: [] }
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const startNewGame = useCallback(async (caseId: number, playerName: string) => {
    setIsLoading(true);
    setError(null);
    resetGame();
    try {
      // No more AI call for issue generation
      const response = ZENITH_CASE;
      
      const narration = response.opening_narrative;
      const initialWorldState = response.initial_world_state;

      const visibleEvidence = response.evidence_files.filter(ev => ev.initially_visible);
      const hiddenEvidence = response.evidence_files.filter(ev => !ev.initially_visible);

      setCurrentIssue({
        ...response,
        evidence_files: visibleEvidence
      });
      setEvidencePool(hiddenEvidence);
      setWorldState(initialWorldState);
      setPlayerStats({
        credibility_score: 75,
        reputation: "Jurnalis Baru",
        articles_published: 0,
        accuracy_history: []
      });
      setTruthExposure(0);
      setArticleCount(0);
      setEvaluation(null);
      setEndingData(null);
      setSocialPlatforms({
        nusantaraX: { platform_name: "NusantaraX", platform_type: "microblogging", ui_hint: "", comments: [] },
        forumNusantara: { platform_name: "ForumNusantara", platform_type: "forum", ui_hint: "", comments: [] },
        kabarnesia: { platform_name: "Kabarnesia", platform_type: "social_feed", ui_hint: "", comments: [] }
      });
    } catch (error) {
      console.error("Critical failure starting game:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const triggerEnding = useCallback(async (type: string) => {
    if (!currentIssue || !worldState) return;
    setIsLoading(true);
    try {
      const response = await callGameAI({
        request_type: RequestType.TRIGGER_ENDING,
        case_id: currentIssue.case_id,
        ending_type: type,
        final_world_state: worldState,
        all_articles: [], 
        final_chain_reactions: currentIssue.active_chain_reactions,
        truth_exposure: truthExposure,
        player_stats: playerStats
      });
      setEndingData(response);
    } catch (error) {
      console.error("Failed to trigger ending:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentIssue, worldState, truthExposure, playerStats]);

  const submitArticle = useCallback(async (article: { headline: string; body: string; evidence_used: string[] }) => {
    console.log("Submitting article:", article);
    if (!currentIssue || !worldState) {
      console.error("Cannot submit: currentIssue or worldState is null", { currentIssue, worldState });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setUnlockNotification(null);
    try {
      const response = (await callGameAI({
        request_type: RequestType.EVALUATE_ARTICLE,
        case_id: currentIssue.case_id,
        article_number: articleCount + 1,
        current_world_state: worldState,
        active_chain_reactions: currentIssue.active_chain_reactions,
        truth_exposure: truthExposure,
        article,
        player_stats: playerStats,
        evidence_pool_remaining: evidencePool.map(e => ({ id: e.id, title: e.title }))
      })) as EvaluationResponse;

      // Update state based on evaluation
      if (response.evaluation) {
        setEvaluation(response.evaluation);
        setWorldState(response.evaluation.new_world_state);
        setPlayerStats(response.evaluation.new_player_stats);
        setTruthExposure(prev => Math.min(100, prev + response.evaluation.truth_contribution));
      }

      if (response.social_media_updates) {
        setSocialPlatforms(prev => {
          const updated = { ...prev };
          Object.entries(response.social_media_updates!).forEach(([key, comments]) => {
            if (updated[key]) {
              updated[key] = {
                ...updated[key],
                comments: [...comments, ...updated[key].comments].slice(0, 50)
              };
            }
          });
          return updated;
        });
      }
      
      setArticleCount(prev => prev + 1);
      
      // Handle evidence unlocking
      let newlyUnlocked: Evidence[] = [];
      if (response.evidence_unlock?.should_unlock) {
        newlyUnlocked = evidencePool.filter(e => response.evidence_unlock.evidence_ids.includes(e.id));
        setEvidencePool(prev => prev.filter(e => !response.evidence_unlock.evidence_ids.includes(e.id)));
        setUnlockNotification({
          message: response.evidence_unlock.unlock_narrative,
          ids: response.evidence_unlock.evidence_ids
        });
      }

      // Update issues/evidence
      setCurrentIssue(prev => prev ? ({
        ...prev,
        active_chain_reactions: [
          ...(prev.active_chain_reactions || []),
          ...(response.evaluation?.triggered_chain_reactions || [])
        ].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i),
        evidence_files: [
          ...(prev.evidence_files || []),
          ...newlyUnlocked
        ]
      }) : null);

      if (response.ending_check?.should_trigger_ending) {
        await triggerEnding(response.ending_check.ending_type!);
      } else if (articleCount + 1 >= 8) { // Increased limit for longer gameplay with gating
        await triggerEnding("GENERATED_ENDING");
      }

      return response;
    } catch (error: any) {
      console.error("Failed to submit article:", error);
      setError(error.message || "Unknown error occurring during article simulation.");
    } finally {
      setIsLoading(false);
    }
  }, [currentIssue, worldState, articleCount, truthExposure, playerStats, triggerEnding, evidencePool]);

  return {
    currentIssue,
    worldState,
    playerStats,
    isLoading,
    truthExposure,
    articleCount,
    evaluation,
    socialPlatforms,
    endingData,
    error,
    unlockNotification,
    setUnlockNotification,
    startNewGame,
    resetGame,
    submitArticle,
    triggerEnding
  };
};
