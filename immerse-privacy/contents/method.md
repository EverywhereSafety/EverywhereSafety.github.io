Our evaluation is structured into three progressive tiers, each targeting a distinct challenge that text-based benchmarks cannot adequately capture. Physically grounded privacy awareness compounds three factors: **(i) Perception:** accurately identifying objects and events in cluttered, multimodal scenes; **(ii) Privacy Awareness:** recognizing a correctly perceived element as privacy-sensitive; and **(iii) Agentic Alignment:** letting a recognized privacy constraint reshape execution when it conflicts with user instructions.

We developed our framework by building upon and customizing the VirtualHome simulator and the Unity Engine, integrating sensitive physical assets and building interactive, privacy-specific scenarios across four environment themes: *home*, *office*, *restaurant*, and *public venue*.

### Tier 1: Perceptual Sensitivity Grounding

Tier 1 foregrounds Perception and Privacy Awareness by challenging models to identify inherently sensitive items (e.g., social security cards, medical records) within cluttered physical environments. Each scenario places a sensitive target among varying numbers of non-sensitive distractors.

Tier 1 consists of two protocols: **(a) Single-Turn:** the model observes the scene from several viewpoints and must list every object it deems sensitive in a single shot, measuring the joint effect of perception and awareness. **(b) Multiple-Turn:** the model proceeds through up to three rounds of progressively closer views, simulating how an embodied agent would physically approach an object to collect visual evidence.

We measure performance with three metrics: **Sensitive Ratio (SR):** precision of sensitivity identification; **Identified Ratio (IR):** recall of sensitivity identification; and **Number of Identified Items:** raw count contextualizing the precision-recall trade-off.

### Tier 2: Dynamic Socio-Contextual Adaptation

![Tier 2 Overview](static/figures/Tier2_01.png)
*Demonstration of failure patterns in Tier 2 case study, including miscalibrated intervention, spatial grounding failure, and unnecessary social conservatism.*

Tier 2 focuses on Agentic Alignment under socio-contextual conflict. Privacy extends beyond shielding sensitive artifacts: the appropriateness of an action depends on the social state of a shared space. We pair a pre-assigned task (e.g., "Clean the office") with candidate actions, while manipulating the underlying social state (e.g., *meeting in progress*, *lone worker*, *unoccupied*).

Each social state is represented with multi-channel perceptual cues without textual labels: egocentric images capturing visual indicators and audio clips capturing the ambient soundscape.

We evaluate with two modes: **(a) Rating Mode:** the model rates every candidate action on a 1–5 scale (measured by Mean Absolute Error, **MAE**); **(b) Selection Mode:** the model chooses the most appropriate action (measured by Selection Accuracy, **SA**).

### Tier 3: History-Conditioned Inferential Adherence

![Tier 3 Overview](static/figures/Tier3_01.png)
*Overview of a Tier 3 scenario. The video shows a character concealing an item. The dialogue requests that it remain private. Both modalities establish the privacy constraint.*

Tier 3 shifts the conflict from the present social state to a constraint that must be *inferred* from prior multimodal observation history. Real-world privacy constraints are dynamic constructs implicitly negotiated through interaction — a trustworthy VLM must extract unstated boundaries from past observations.

Each scenario unfolds in two stages: first, the model passively observes a scripted history (video of physical actions paired with synthesized dialogue establishing the privacy boundary). Then, an unaware third party issues a benign command that inadvertently collides with the established boundary. The model must decide whether to blindly execute or protect the privacy constraint.

We employ three metrics: **Task Completeness Rate (TCR):** fraction of legitimate actions selected; **Privacy Preservation Rate (PPR):** fraction of selections not violating the constraint; and **Exact Match (EM):** fraction of cases with exactly correct selection.
