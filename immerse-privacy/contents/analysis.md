Beyond the three-tier evaluation, we conduct two additional analyses to disentangle the sources of failure and compare against text-based baselines.

### Perception Probe: Disentangling Perception from Awareness

To separate **perception failure** (the model cannot see the sensitive object) from **awareness failure** (the model sees it but does not flag it as sensitive), we design a two-turn probe. In Turn 1, the model is shown close-up images and asked to exhaustively list every object it perceives. In Turn 2, it is asked which of those objects are sensitive. A failure case is classified as *perception failure* when the ground-truth item does not appear in the Turn 1 list, and as *awareness failure* when the item is listed in Turn 1 but omitted from the Turn 2 answer.

![Perception Failures](static/figures/perception_probe_failures_01.png)
*Perception vs. awareness failure rates across item-count settings. Gemini-3.1-Pro is perception-limited (30–34%), whereas Qwen3-Omni-Flash exhibits a uniquely high awareness failure rate (28–38%).*

Two model-specific patterns emerge:

- **Perception-limited models.** `gemini-3.1-pro` shows the highest perception failure (above 30% across all settings), while its awareness failure remains moderate. Its Tier 1 errors are primarily attributable to an inability to resolve the sensitive object from cluttered close-up views.
- **Awareness-limited models.** `qwen3-omni-flash` exhibits the opposite pattern. Perception rates are comparable to other models, but awareness failure is disproportionately high (28–38%) and *increases* with scene complexity. Even when the model correctly perceives the sensitive item, it frequently fails to classify it as sensitive.

Critically, **no model achieves fewer than 10% in both failure modes simultaneously**, demonstrating that perception and awareness are inherently entangled in real-world embodied scenarios, and thereby a trustworthy agent must both visually ground an object *and* recognize its privacy implications.

### PDDL Text-Only Baseline Comparison

To quantify how much the visual modality contributes to the difficulty of Tier 1, we compare our rendered-scene approach against a text-only baseline that presents the same scenarios as PDDL problem definitions — the representation used by prior text-based benchmarks.

| | | **5-item** | | | | | | **15-item** | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | | PDDL | | | Visual | | | PDDL | | | Visual | |
| **Model** | IR | SR | #Pred | IR | SR | #Pred | IR | SR | #Pred | IR | SR | #Pred |
| gemini-3-flash† | 0.98 | 0.69 | 1.7 | 0.58 | 0.49 | 0.9 | 0.92 | 0.44 | 2.8 | 0.64 | 0.54 | 1.0 |
| gemini-3.1-pro† | 0.82 | 0.57 | 1.6 | 0.38 | 0.31 | 0.7 | 0.82 | 0.39 | 3.2 | 0.38 | 0.25 | 0.9 |
| qwen3-omni-flash | 0.92 | 0.39 | 3.7 | 0.00 | 0.00 | 0.3 | 0.74 | 0.26 | 8.0 | 0.00 | 0.00 | 0.2 |
| qwen3.5-27b | 0.58 | 0.46 | 1.1 | 0.34 | 0.29 | 0.7 | 0.60 | 0.40 | 1.9 | 0.30 | 0.21 | 1.3 |

*PDDL text-only vs. visual approach on Tier 1. #Pred = average number of predicted sensitive objects per scene. †: without thinking mode.*

Three findings emerge:

- **PDDL object names leak semantics.** IR under the PDDL condition is substantially higher across all models. Because PDDL type names like `social_security_card.n.01` directly encode the object's identity, models can resolve sensitivity from the name alone, bypassing the perceptual and contextual reasoning that the visual condition demands.
- **Absence of visual evidence inflates false positives.**  Under the PDDL condition models predict far more objects per scene than under the visual condition, indicating that without concrete visual evidence to anchor judgments, models default to flagging aggressively, substantially inflating false positives.
- **Visual clutter is not captured by PDDL.** Under the PDDL condition the performance drop from 5 to 15 items is modest, whereas the visual condition exhibits sharper degradation. This confirms that visual scene clutter constitutes a genuine challenge that symbolic representations cannot simulate.

Together, these analyses demonstrate that **reducing visual privacy to text classification does not produce reliable sensitivity judgments**, motivating the necessity of our multimodal evaluation framework.
