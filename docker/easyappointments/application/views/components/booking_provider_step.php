<div id="wizard-frame-3" class="wizard-frame p-3 p-md-4" style="display:none;">
    <div class="frame-container py-3">
        <h2 class="frame-title fw-light text-center mb-4 text-muted"><?= lang('provider') ?></h2>

        <div id="provider-choices" class="booking-choice-grid booking-provider-grid" role="group"
             aria-label="<?= e(lang('provider')) ?>"></div>
        <p id="provider-selection-prompt" class="text-danger mt-3 mb-0" hidden>
            <?= lang('please_select') ?>
        </p>

        <div class="visually-hidden" aria-hidden="true">
            <label for="select-provider"><?= lang('provider') ?></label>
            <select id="select-provider" tabindex="-1">
                <option value=""><?= lang('please_select') ?></option>
            </select>
        </div>
    </div>

    <div class="command-buttons text-center my-3 mx-auto d-md-flex justify-content-md-between">
        <button type="button" id="button-back-3" class="btn button-back btn-outline-secondary"
                data-step_index="3">
            <i class="fas fa-chevron-left me-2"></i>
            <?= lang('back') ?>
        </button>
    </div>
</div>
