We evaluate 12 models spanning four provider families across over 400 procedurally generated scenarios in more than 40 unique physical environments.

### Tier 1: Perceptual Sensitivity Grounding

![Single-Turn Results](static/figures/tier1_01.png)
*Tier 1 Single-Turn performance across representative models. SR and IR decay monotonically with scene complexity.*

**Single-Turn** results reveal three key trends:

- **Complexity-dependent fragility**: across every competent model, both SR and IR decrease monotonically with distractor count. Only the Gemini-3 family clears 0.5 SR in non-trivial scenes.
- **SR–IR trade-off**: IR degrades more slowly than SR, indicating that under clutter, models keep flagging the truly sensitive item but increasingly over-flag irrelevant distractors.
- **Consistent positive effect of thinking**: chain-of-thought reasoning uniformly improves performance across model families, with `qwen3.5` exhibiting the starkest gap.

![Multi-Turn Results](static/figures/tier1_multiround_01.png)
*Multi-Turn protocol: IR stabilizes with closer views while SR still degrades for models that over-flag, confirming a perceptual bottleneck.*

**Multiple-Turn** results confirm the perceptual bottleneck: IR rises to ~0.8 and stays flat across complexity, while SR still degrades for several models. Once given close-up views, models reliably detect the sensitive item, indicating that the Single-Turn decay is predominantly a perception problem, and the Multiple-Turn plateau is an upper bound of privacy awareness under visual evidence.

![Human Comparison](static/figures/tier1_with_human_01.png)
*Human raters achieve near-perfect performance across all complexity levels, confirming failures are model-specific, not artifacts of ambiguous rendering.*

### Tier 2: Dynamic Socio-Contextual Adaptation

| | Random | gemini-3-flash (w/o think) | gemini-3-flash | gemini-3.1-pro (w/o think) | gemini-3.1-pro | gpt-4o-mini | gpt-5.4 | doubao-seed-2.0-lite | qwen3.5 (w/o think) | qwen3.5 | qwen3-omni-flash (w/o think) | qwen3-omni-flash | InternVL3.5-8B |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **MAE** ↓ | — | 1.41 | 1.35 | 1.78 | 1.74 | 1.32 | **1.03** | 1.22 | 1.39 | 1.26 | 1.28 | 1.27 | 1.07 |
| **SA** ↑ | — | 0.49 | 0.54 | 0.40 | 0.45 | 0.39 | 0.64 | 0.52 | 0.56 | **0.65** | 0.51 | 0.52 | 0.48 |

The results expose a pronounced **social-context gap**. `gpt-5.4` achieves the lowest rating deviation (MAE = 1.03) while `qwen3.5` (thinking) leads Selection Accuracy at 0.65. No model exceeds 65% SA.

![Error Distribution](static/figures/tier2_selection_wrong_distribution_tie_tolerant_01.png)
*Distribution histogram of incorrect actions on rating categories. Models with low MAE tend to err toward positive rather than negative alternatives.*

Case-level analysis reveals three failure modes: **(i) Miscalibrated intervention intensity:** models converge on a default engagement level regardless of context; **(ii) Spatial grounding failure:** weaker models misread their own position in the environment; **(iii) Unnecessary social conservatism:** stronger models over-correct, preferring to observe or defer rather than act.

### Tier 3: History-Conditioned Inferential Adherence

| | Random | gemini-3-flash (w/o think) | gemini-3-flash | gemini-3.1-pro (w/o think) | gemini-3.1-pro | doubao-seed-2.0-lite | qwen3.5 (w/o think) | qwen3.5 | qwen3-omni-flash (w/o think) | qwen3-omni-flash | InternVL3.5-8B |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **PPR** ↑ | 0.67 | 0.65 | 0.67 | 0.88 | **0.93** | 0.65 | 0.72 | 0.69 | 0.53 | 0.54 | 0.49 |
| **TCR** ↑ | 0.50 | 0.79 | **0.87** | 0.75 | 0.77 | 0.82 | 0.77 | 0.85 | 0.37 | 0.38 | 0.45 |
| **EM** ↑ | 0.14 | 0.09 | 0.15 | 0.46 | **0.51** | 0.17 | 0.30 | 0.18 | 0.01 | 0.01 | 0.11 |

Results expose a systematic **alignment bias toward task completion**. When a benign command conflicts with an implicitly established privacy boundary, models default to carrying out the command. TCR consistently exceeds 0.75 for all competent models, while PPR hovers near the 0.67 random level for most. Only `gemini-3.1-pro` meaningfully breaks away (PPR = 0.93, EM = 0.51). 

![Response Distribution](static/figures/tier3_selection_distribution_01.png)
*Distribution of the response across representative models. All questions have three candidate options, among which two are correct and one violates privacy.*

Three failure modes emerge: **(i) Blind compliance:** strong models select all three actions over 50% of the time, with the explicit command overriding the inferred privacy constraint; **(ii) Selection collapse with sensitive-item bias:** weaker models collapse to single-action selection, disproportionately choosing the privacy-violating action; **(iii) Paradoxical effect of thinking:** for some models, enabling thinking pushes the distribution further toward compliance, as chain-of-thought foregrounds the explicit command at the expense of the inferred constraint.

An ablation replacing audio with semantic text descriptions confirms that **audio perception is not the bottleneck** as the failures persist even when the perceptual demand of audio comprehension is removed entirely.
